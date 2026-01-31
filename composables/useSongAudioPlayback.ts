import type { SongInfo } from "~~/types/song";

type AudioPlaybackOptions = {
  storageKey: string;
  getSongKey: (song: SongInfo) => string;
  getAudioFile: (song: SongInfo) => string | null;
};

export const useSongAudioPlayback = (options: AudioPlaybackOptions) => {
  const activeAudio = ref<HTMLAudioElement | null>(null);
  const activeAudioKey = useState<string | null>(
    `${options.storageKey}-active-audio-key`,
    () => null,
  );
  const activeSong = useState<SongInfo | null>(
    `${options.storageKey}-active-song`,
    () => null,
  );
  const isActiveAudioPlaying = useState<boolean>(
    `${options.storageKey}-active-audio-playing`,
    () => false,
  );
  const currentTime = useState<number>(
    `${options.storageKey}-active-audio-time`,
    () => 0,
  );
  const duration = useState<number>(
    `${options.storageKey}-active-audio-duration`,
    () => 0,
  );
  const activeAudioHandlers = ref<{
    timeUpdate: () => void;
    durationChange: () => void;
    ended: () => void;
  } | null>(null);
  const pendingSeekTime = ref<number | null>(null);

  const removeActiveAudioHandlers = () => {
    if (!activeAudio.value || !activeAudioHandlers.value) {
      return;
    }

    activeAudio.value.removeEventListener(
      "timeupdate",
      activeAudioHandlers.value.timeUpdate,
    );
    activeAudio.value.removeEventListener(
      "durationchange",
      activeAudioHandlers.value.durationChange,
    );
    activeAudio.value.removeEventListener(
      "loadedmetadata",
      activeAudioHandlers.value.durationChange,
    );
    activeAudio.value.removeEventListener(
      "ended",
      activeAudioHandlers.value.ended,
    );
    activeAudioHandlers.value = null;
  };

  const stopActiveAudio = () => {
    if (activeAudio.value) {
      removeActiveAudioHandlers();
      activeAudio.value.pause();
      activeAudio.value.currentTime = 0;
      activeAudio.value = null;
    }
    activeAudioKey.value = null;
    activeSong.value = null;
    isActiveAudioPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
    pendingSeekTime.value = null;
  };

  const toggleAudioPlayback = (song: SongInfo) => {
    const audioFile = options.getAudioFile(song);
    if (!audioFile) {
      return;
    }

    const key = options.getSongKey(song);
    if (activeAudioKey.value === key && activeAudio.value) {
      if (activeAudio.value.paused) {
        void activeAudio.value.play();
        isActiveAudioPlaying.value = true;
      } else {
        activeAudio.value.pause();
        isActiveAudioPlaying.value = false;
      }
      return;
    }

    stopActiveAudio();

    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = audioFile;
    activeAudio.value = audio;
    activeAudioKey.value = key;
    activeSong.value = song;
    isActiveAudioPlaying.value = true;

    const handleTimeUpdate = () => {
      if (activeAudio.value !== audio) {
        return;
      }
      currentTime.value = audio.currentTime;
    };
    const handleDurationChange = () => {
      if (activeAudio.value !== audio) {
        return;
      }
      duration.value = Number.isFinite(audio.duration) ? audio.duration : 0;
      if (pendingSeekTime.value != null && duration.value > 0) {
        audio.currentTime = Math.min(
          Math.max(0, pendingSeekTime.value),
          duration.value,
        );
        currentTime.value = audio.currentTime;
        pendingSeekTime.value = null;
      }
    };
    const handleEnded = () => {
      if (activeAudio.value !== audio) {
        return;
      }
      isActiveAudioPlaying.value = false;
      activeAudioKey.value = null;
      activeAudio.value = null;
      activeSong.value = null;
      currentTime.value = 0;
      duration.value = 0;
    };

    activeAudioHandlers.value = {
      timeUpdate: handleTimeUpdate,
      durationChange: handleDurationChange,
      ended: handleEnded,
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    void audio.play();
  };

  const seekTo = (time: number) => {
    if (!activeAudio.value) {
      return;
    }

    const target = Math.max(0, time);
    if (!Number.isFinite(duration.value) || duration.value <= 0) {
      pendingSeekTime.value = target;
      return;
    }
    activeAudio.value.currentTime = Math.min(target, duration.value);
    currentTime.value = activeAudio.value.currentTime;
  };

  onBeforeUnmount(() => {
    stopActiveAudio();
  });

  onBeforeRouteLeave(() => {
    stopActiveAudio();
  });

  return {
    activeAudioKey,
    activeSong,
    isActiveAudioPlaying,
    currentTime,
    duration,
    seekTo,
    stopActiveAudio,
    toggleAudioPlayback,
  };
};

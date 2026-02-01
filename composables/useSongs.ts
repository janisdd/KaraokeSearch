import type { SongInfo } from "~~/types/song";

export const useSongs = () => {
  const songs = useState<SongInfo[]>("songs", () => []);
  const pending = useState<boolean>("songs-pending", () => false);
  const error = useState<Error | null>("songs-error", () => null);

  const refresh = async () => {
    if (pending.value) {
      return;
    }

    pending.value = true;
    error.value = null;

    try {
      songs.value = await $fetch<SongInfo[]>("/api/songs");
    } catch (err) {
      error.value = err as Error;
    } finally {
      pending.value = false;
    }
  };

  if (process.client && songs.value.length === 0 && !pending.value) {
    void refresh();
  }

  return {
    songs,
    pending,
    error,
    refresh,
  };
};

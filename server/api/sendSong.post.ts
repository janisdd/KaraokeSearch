import { ConfigHelper } from "~/helpers/configHelper";
import { Indexer } from "~/helpers/songsIndexer";

// this type is used to forward the song to the ultra star app (we are the companion app)
type UltraStarCompanionForwardRequest = {
  title: string;
  artist: string;
};

type UltraStartCompanionPaths = `/selectSong` | `/addToCompanionPlaylist`;

export default defineEventHandler(async (event) => {
  const body = await readBody<{ songId?: string }>(event);
  const songId = body?.songId;

  if (!songId) {
    throw createError({ statusCode: 400, message: "Missing songId" });
  }

  const song = Indexer.getSongsMap().get(songId);
  if (!song) {
    throw createError({ statusCode: 404, message: "Song not found" });
  }

  const port = ConfigHelper.getUltraStarCompanionPort();
  if (!port) {
    throw createError({ statusCode: 500, message: "Ultra Star Companion port not set" });
  }

  const payload: UltraStarCompanionForwardRequest = {
    title: song.title,
    artist: song.artist,
  };

  const response = await fetch(`http://localhost:${port}/selectSong`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw createError({
      statusCode: 502,
      message: `Failed to forward song: ${response.status} ${response.statusText}`,
    });
  }

  return { ok: true };
});

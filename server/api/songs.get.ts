import { Indexer } from "~/helpers/songsIndexer";

export default defineEventHandler(async () => {
 
  try {
    const songs = Array.from(Indexer.getSongsMap().values());
    return songs;
  } catch {
    // On any error, be resilient and return empty
    return [];
  }
});


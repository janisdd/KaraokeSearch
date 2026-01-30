import dotenv from 'dotenv'
import fs from "fs";

dotenv.config({ path: "./secrets/.env" });
if (!fs.existsSync("./secrets/.env")) {
  throw createError({ statusCode: 500, message: "Secrets file not found" });
}

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

const PlaylistCacheDirPath = process.env.PLAYLIST_CACHE_DIR_PATH || "";
const UltraStartSongsDirPath = process.env.ULTRA_START_SONGS_DIR_PATH || "";

if (!PlaylistCacheDirPath || !UltraStartSongsDirPath) {
  throw createError({ statusCode: 500, message: "Playlist cache directory or UltraStar songs directory not set" });
}

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.warn("Spotify Client ID or Client Secret not set -> spotify api will not work");
}

export class ConfigHelper {
  static getPlaylistCacheDirPath() {
    return PlaylistCacheDirPath;
  }

  static getUltraStartSongsDirPath() {
    return UltraStartSongsDirPath;
  }

  static getClientId() {
    return SPOTIFY_CLIENT_ID;
  }

  static getClientSecret() {
    return SPOTIFY_CLIENT_SECRET;
  }
}
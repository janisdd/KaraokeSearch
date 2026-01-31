import { config as loadEnv } from 'dotenv'


export default defineNitroPlugin(() => {
  loadEnv()
  console.log(
    '[nuxt start] ULTRA_START_SONGS_DIR_PATH:',
    process.env.ULTRA_START_SONGS_DIR_PATH,
  )
  console.log(
    '[nuxt start] PLAYLIST_CACHE_DIR_PATH:',
    process.env.PLAYLIST_CACHE_DIR_PATH,
  )
  console.log(
    '[nuxt start] IS_DEFAULT_PAGE_THEME_MODE_DARK:',
    process.env.IS_DEFAULT_PAGE_THEME_MODE_DARK,
  )
})

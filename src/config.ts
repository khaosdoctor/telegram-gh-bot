import * as dotenv from 'std/dotenv/mod.ts'
await dotenv.config({ export: true })

export const config = {
  bot: {
    token: Deno.env.get('BOT_TOKEN') ?? '',
    secret: Deno.env.get('BOT_SECRET') ?? ''
  },
  gh: {
    token: Deno.env.get('GH_API_TOKEN') ?? ''
  }
}
export type AppConfig = typeof config

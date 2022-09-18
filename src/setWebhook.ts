import { Bot } from 'x/grammy@v1.11.0/mod.ts'
import { config } from './config.ts'

const bot = new Bot(config.bot.token)
await bot.init()
await bot.api.setWebhook(Deno.args[0], { secret_token: config.bot.secret }).then(console.log)

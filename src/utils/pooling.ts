import { getBot } from '../bot.ts'
import { config } from '../config.ts'

const bot = getBot(config)
bot.start({
  onStart: ({ username }) => console.log(`Bot started as @${username}`),
  drop_pending_updates: true
})

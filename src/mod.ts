import { webhookCallback } from 'x/grammy@v1.11.0/mod.ts'
import { serve } from 'x/sift@0.5.0/mod.ts'
import { getBot } from './bot.ts'
import { config } from './config.ts'
const bot = getBot(config)

const handleUpdate = webhookCallback(bot, 'std/http', { secretToken: config.bot.secret })

serve({
  '/': (req) => {
    return req.method === 'POST' ? handleUpdate(req) : new Response('Not found', { status: 404 })
  }
})

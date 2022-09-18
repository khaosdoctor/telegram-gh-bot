import { Bot } from 'x/grammy@v1.11.0/mod.ts'
import type { AppConfig } from './config.ts'
import { search } from './core/gh.ts'

function getBot(config: AppConfig) {
  const bot = new Bot(config.bot.token)

  bot.on('inline_query', async (ctx) => {
    const { query } = ctx.inlineQuery
    if (!query) return ctx.answerInlineQuery([])

    const results = await search(query)
    if (results.total_count <= 0) return ctx.answerInlineQuery([])

    return ctx.answerInlineQuery(
      results.items.map((item) => ({
        type: 'article',
        id: item.id.toString(),
        title: item.full_name,
        url: item.html_url,
        cache_time: 300,
        input_message_content: {
          message_text: `[${item.full_name}](${item.html_url})
  _${item.description || 'No Description'}_

  *Stars:* ${item.stargazers_count}
  *Forks:* ${item.forks_count}
  *Language:* ${item.language}`,
          parse_mode: 'Markdown'
        },
        hide_url: true,
        description: item.description || 'No description',
        thumb_url: item.owner.avatar_url
      }))
    )
  })
  return bot
}

export { getBot }

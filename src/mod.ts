import { config } from 'std/dotenv/mod.ts'
import { serve } from 'std/http/server.ts'
import { Update } from 'x/grammy@v1.11.0/types.ts'

config({ export: true })

interface GHSearchResult {
  total_count: number
  incomplete_results: boolean
  items: GHSearchItem[]
}

interface GHSearchItem {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    id: number
    avatar_url: string
    url: string
    html_url: string
  }
  html_url: string
  description: string
  fork: boolean
  stargazers_count: number
  watchers_count: number
  language: string
  forks_count: number
}

const search = async (query: string) => {
  const sanitized = query.replace('https://github.com/', '')
  const result = await fetch(`https://api.github.com/search/repositories?q=${sanitized}&per_page=3`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${Deno.env.get('GH_API_TOKEN')}`
    }
  })
  return result.json() as Promise<GHSearchResult>
}

serve(async (req: Request) => {
  if (!req.body) return new Response()
  const update: Update = await req.json()
  if (!('inline_query' in update)) return new Response()

  const { query, id } = update.inline_query!
  if (!query) return new Response()

  const results = await search(query)
  if (results.total_count <= 0) return new Response()

  const response = {
    method: 'answerInlineQuery',
    inline_query_id: id,
    results: results.items.map((item) => ({
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
  }

  fetch(`https://api.telegram.org/bot${Deno.env.get('BOT_TOKEN')}/${response.method}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(response)
  })
    .then((res) => res.json())
    .then(console.log)
    .catch(console.error)

  return new Response()
})

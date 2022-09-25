import { config } from '../config.ts'

export interface GHSearchResult {
  total_count: number
  incomplete_results: boolean
  items: GHSearchItem[]
}

export interface GHSearchItem {
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

export const search = async (query: string) => {
  const sanitized = query.replace('https://github.com/', '')
  const result = await fetch(`https://api.github.com/search/repositories?q=${sanitized}&per_page=3`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${config.gh.token}`
    }
  })
  return result.json() as Promise<GHSearchResult>
}

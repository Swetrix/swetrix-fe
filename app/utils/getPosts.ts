import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import { marked } from 'marked'
import _map from 'lodash/map'
import _replace from 'lodash/replace'
import { LoaderFunction } from '@remix-run/node'

export type PostMarkdownAttributes = {
  title: string
  intro: string
  date: string
  author: string
  nickname: string
  hidden?: boolean
}

interface IParseFontMatter {
  attributes: PostMarkdownAttributes
  body: string
}

export const postsPath = path.join(__dirname, '..', 'blog-posts', 'posts')

export async function getPost(slug: string) {
  const filepath = path.join(postsPath, slug + '.md')
  const file = await fs.readFile(filepath)
  const { attributes, body }: IParseFontMatter = parseFrontMatter(file.toString())
  return { slug, title: attributes.title, html: marked(body), hidden: attributes.hidden, intro: attributes.intro, date: attributes.date, author: attributes.author, nickname: attributes.nickname }
}

export const blogLoader: LoaderFunction = async () => {
  const dir = await fs.readdir(postsPath)

  return Promise.all(
    _map(dir, async filename => {
      const file = await fs.readFile(
        path.join(postsPath, filename)
      )
      const { attributes }: IParseFontMatter = parseFrontMatter(
        file.toString()
      )
      return {
        slug: _replace(filename, /\.md$/, ''),
        title: attributes.title,
        hidden: attributes.hidden,
        intro: attributes.intro,
        date: attributes.date,
        author: attributes.author,
        nickname: attributes.nickname,
      }
    })
  )
}

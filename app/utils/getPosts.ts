import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import { marked } from 'marked'
import _map from 'lodash/map'
import _find from 'lodash/find'
import _includes from 'lodash/includes'
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

// Removes first 10 characters from the string (i.e. 2023-10-07-)
export const getSlugFromFilename = (filename: string) => filename.substring(11)
export const getDateFromFilename = (filename: string) => filename.substring(0, 10)

const findFilenameBySlug = (list: string[], handle: string) => {
  return _find(list, (item) => _includes(item, handle))
}

export const getFileNames = async (): Promise<string[]> => {
  return fs.readdir(postsPath) as Promise<string[]>
}

export async function getPost(slug: string) {
  const files = await getFileNames()
  const filename = findFilenameBySlug(files, slug)

  if (!filename) {
    return null
  }

  const filepath = path.join(postsPath, filename)

  const file = await fs.readFile(filepath)
  const { attributes, body }: IParseFontMatter = parseFrontMatter(file.toString())

  return {
    slug,
    title: attributes.title,
    html: marked(body),
    hidden: attributes.hidden,
    intro: attributes.intro,
    date: attributes.date,
    author: attributes.author,
    nickname: attributes.nickname,
  }
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
        slug: _replace(getSlugFromFilename(filename), /\.md$/, ''),
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

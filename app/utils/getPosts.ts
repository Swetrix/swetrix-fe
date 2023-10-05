import path from "path"
import fs from "fs/promises"
import parseFrontMatter from "front-matter"
import { marked } from "marked"
import _map from "lodash/map"
import _replace from "lodash/replace"

export type PostMarkdownAttributes = {
    title: string
    isVisable: boolean
    intro: string
    date: string
    author: string
    nickname: string
}

export function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
    return (
        typeof attributes.title === "string" &&
        typeof attributes.isVisable === "boolean" &&
        typeof attributes.intro === "string" &&
        typeof attributes.date === "string" &&
        typeof attributes.author === "string" &&
        typeof attributes.nickname === "string"
    )
}

export const postsPath = path.join(__dirname, "..", "posts")

export async function getPost(slug: string) {
    const filepath = path.join(postsPath, slug + ".md")
    const file = await fs.readFile(filepath)
    const { attributes, body } = parseFrontMatter(file.toString())
    if (!isValidPostAttributes(attributes)) {
        throw new Error(`Post ${filepath} is missing attributes`)
    }
    return { slug, title: attributes.title, html: marked(body), isVisable: attributes.isVisable, intro: attributes.intro, date: attributes.date, author: attributes.author, nickname: attributes.nickname }
}

export async function getPosts() {
    const dir = await fs.readdir(postsPath)
    return Promise.all(
        _map(dir, async filename => {
            const file = await fs.readFile(
                path.join(postsPath, filename)
            )
            const { attributes } = parseFrontMatter(
                file.toString()
            )
            if (!isValidPostAttributes(attributes)) {
                throw new Error(`${filename} has bad meta data!`)
            }
            return {
                slug: _replace(filename, /\.md$/, ""),
                title: attributes.title,
                isVisable: attributes.isVisable,
                intro: attributes.intro,
                date: attributes.date,
                author: attributes.author,
                nickname: attributes.nickname,
            }
        })
    )
}

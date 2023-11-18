import type { LoaderFunction, LinksFunction, V2_MetaFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import singlePostCss from 'css/mdfile.css'
import { getPost } from 'utils/getPosts'
import { isSelfhosted, TITLE_SUFFIX } from 'redux/constants'
import Post from 'pages/Blog/Post'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: singlePostCss }]
}

export const meta: V2_MetaFunction = (loaderData: any) => {
  return [
    {
      title: `${loaderData?.data?.title || 'Blog'} ${TITLE_SUFFIX}`,
    },
    {
      property: "og:title",
      content: `${loaderData?.data?.title || 'Blog'} ${TITLE_SUFFIX}`,
    },
    {
      property: "og:description",
      content: loaderData?.data?.intro || '',
    },
    {
      property: "twitter:description",
      content: loaderData?.data?.intro || '',
    },
    {
      property: "description",
      content: loaderData?.data?.intro || '',
    },
  ]
}

export const loader: LoaderFunction = async ({ params }) => {
  if (isSelfhosted) {
    return redirect('/dashboard', 302)
  }

  const { slug, category } = params

  if (!slug || !category) {
    return json(null, {
      status: 404,
    })
  }

  const post = await getPost(slug, category)

  if (!post) {
    return json(null, {
      status: 404,
    })
  }

  return post
}

export default Post

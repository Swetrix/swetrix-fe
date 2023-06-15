import ProjectSettings from 'pages/Project/Settings/ProjectSettings'
import type { V2_MetaFunction } from '@remix-run/node'

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: 'Project Settings',
      description: 'Project Settings',
    },
  ]
}

export default function Index() {
  return <ProjectSettings />
}

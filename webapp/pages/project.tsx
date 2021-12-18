import { NextPage, NextApiResponse } from 'next'
import Router from 'next/router'
import { useEffect } from 'react'

import useSession from '../hooks/useSession'
import Layout from '../components/layout/Layout'
import ClientSideLink from '../components/clientSideLink/ClientSideLink'

interface Context {
  query: { id: string },
  res: NextApiResponse
}

class ServerSideProps {
  readonly projectId: string

  constructor (projectId: string) {
    this.projectId = projectId
  }
}

export async function getServerSideProps (context: Context) {
  if (!context.query.id) {
    context.res.writeHead(404, { Location: '/not-found' })
    context.res.end()
  }
  return { props: { projectId: context.query.id } }
}

const ProjectPage: NextPage = (props: ServerSideProps) => {

  const { isLogged } = useSession()
  
  useEffect(() => {
    if (!isLogged) {
      Router.push('/')
    }
  }, [isLogged])

  return (
    <Layout pageTitle='Project name'>
      <section>
        <ClientSideLink
          linkText='Back to projects list'
          href='/projects'
          imgSrc='/icons/plus.svg'
        /> 
      </section>
      <style jsx>{`
          section {
            height: 100%;
            margin: 0 20px;
          }
      `}</style>
    </Layout>
  )
}

export default ProjectPage

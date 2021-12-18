import { NextPage, NextApiResponse } from 'next'
import Router, { useRouter } from 'next/router'
import { useEffect } from 'react'

import useSession from '../../hooks/useSession'
import Layout from '../../components/layout/Layout'
import ClientSideLink from '../../components/clientSideLink/ClientSideLink'

const ProjectPage: NextPage = () => {

  const router = useRouter()
  const { isLogged } = useSession()

  const { projectId } = router.query;
  
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
        {projectId}
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

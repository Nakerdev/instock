import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { Option, none, some, match } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

import useSession from '../hooks/useSession'
import { colors, fonts } from '../styles/theme'
import RocketIcon from '../components/icons/Rocket'
import { ProjectList, Project } from '../components/projectList/ProjectList'
import Nav from '../components/nav/Nav'

const Dashboard: NextPage = () => {
  const [selectedProject, setSelectedProject] = useState<Option<Project>>(none)

  const { isLogged } = useSession()

  useEffect(() => {
    if (!isLogged) {
      Router.push('/')
    }
  }, [isLogged])

  return (
    <>
    <Nav/>
    <main>
      <ProjectList 
        onProjectSelectedHandler={(project: Project) => setSelectedProject(some(project))}
      />
    </main>
    <style jsx>{`
        main {
            background-color: ${colors.background};
            height: 100vh;
            display: flex;
            flex-direction: row;
        }

        main > section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        main > section > h2 {
          font-size: 24px;
          font-family: ${fonts.base};
        }
    `}</style>
    </>
  )
}

export default Dashboard

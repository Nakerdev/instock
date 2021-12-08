import { useEffect, useState } from 'react'

import { colors, fonts } from '../../styles/theme'
import useSession from '../../hooks/useSession'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Button from '../button/Button'

export {
  ProjectList,
  Project
}

class Project {
  readonly id: string
  readonly name: string

  constructor (id: string, name: string) {
    this.id = id
    this.name = name
  }
}

function ProjectList () {
  const { getSession } = useSession()

  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectSearchingInProgress, setIsProjectSearchingInProgress] = useState(true)
  const [serverErrorMessage, setServerErrorMessage] = useState('')

  useEffect(() => {
    (async function searchProjects () {
      setProjects([])
      setServerErrorMessage('')
      setIsProjectSearchingInProgress(true)
      const session: string | null = getSession()
      const response = await fetch(
        '/api/projects/searchAll',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-stockout-token': session === null ? '' : session
          }
        }
      )
      if (response.status === 200 || response.status === 304) {
        setIsProjectSearchingInProgress(false)
        const userProjects: Project[] = await response.json()
        setProjects(userProjects)
      } else {
        setIsProjectSearchingInProgress(false)
        setServerErrorMessage('Oops! Something went wrong! We can\'t search your projects but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    })()
  }, [])

  return (
        <>
        <section>
          {
            isProjectSearchingInProgress && (
              <div className='spinner-container'>
                <img src='/gifs/eclipse-blue.gif'></img>
                <p>Searching projects...</p>
              </div>
            )
          }
          {
            projects.map(project => {
              return (
                <Button
                  isDisabled={false}
                  text={project.name}
                  textColor={colors.black}
                  bgColor={colors.blue}
                  onClickHandler={() => {}}
                  key={project.id} 
                />
              )
            })
          }
          <ErrorMessage message={serverErrorMessage}/>
        </section>
        <style jsx>{`
          section {
            width: 100%
          }

          .spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .spinner-container > img {
            width: 150px;
          }

          .spinner-container > p {
            margin-top: 10px;
            font-family: ${fonts.base};
          }
        `}</style>
        </>
  )
}

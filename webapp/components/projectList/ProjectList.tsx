import { useEffect, useState } from 'react'

import { colors, fonts } from '../../styles/theme'
import Button from '../button/Button'
import useSession from '../../hooks/useSession'
import ErrorMessage from '../errorMessage/ErrorMessage'

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
  const [serverErrorMessage, setServerErrorMessage] = useState('')

  useEffect(() => {
    (async function searchProjects () {
      setServerErrorMessage('')
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
        const userProjects: Project[] = await response.json()
        setProjects(userProjects)
      } else {
        setServerErrorMessage('Oops! Something went wrong! We can\'t search your projects but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    })()
  }, [])

  return (
        <>
        <section>
          {
            projects.map(project => {
              return (
                <article className='project-container' key={project.id}>
                  <p>{project.name}</p>
                  <div>
                    <Button
                      text=''
                      onClickHandler={() => {}}
                      bgColor={colors.grey}
                      isDisabled={false}
                      buttonInnerImgSrc='/icons/pencil.svg'
                    />
                    <Button
                      text=''
                      onClickHandler={() => {}}
                      bgColor={colors.grey}
                      isDisabled={false}
                      buttonInnerImgSrc='/icons/trash.svg'
                    />
                  </div>
                </article>
              )
            })
          }
          <ErrorMessage message={serverErrorMessage}/>
        </section>
        <style jsx>{`
          section {
            width: 100%
          }

          article {
            width: 100%;
            background-color: ${colors.blue};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 10px 0px;
            border-radius: 5px;
          }

          article > p {
            margin-left: 5px;
            display: block;
            font-family: ${fonts.base};
          }

          article > div {
            width: 100px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-top: 10px;
          }
        `}</style>
        </>
  )
}

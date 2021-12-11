import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect, useState, MouseEvent } from 'react'

import useSession from '../hooks/useSession'
import { colors, fonts } from '../styles/theme'
import Nav from '../components/nav/Nav'
import ErrorMessage from '../components/errorMessage/ErrorMessage'
import Button from '../components/button/Button'
import { ProjectCreationControllerRequest } from './api/projects/create/controller'
import TextField from '../components/textField/TextField'
import Modal from '../components/modal/Modal'
import { ErrorResponse } from './api/utils/apiUtils'
import RocketIcon from '../components/icons/Rocket'
import ClientSideLink from '../components/clientSideLink/ClientSideLink'
import Layout from '../components/layout/Layout'

class Project {
  readonly id: string
  readonly name: string

  constructor (id: string, name: string) {
    this.id = id
    this.name = name
  }
}

const Dashboard: NextPage = () => {
  const { isLogged, getSession } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [showedProjects, setShowedProjects] = useState<Project[]>([])
  const [isProjectSearchingInProgress, setIsProjectSearchingInProgress] = useState(true)
  const [serverErrorMessage, setServerErrorMessage] = useState('')
  const [filterText, setFilterText] = useState('')
  const [isNewProjectModalShown, setIsNewProjectModalShown] = useState(false)
  const [projectNameError, setProjectNameError] = useState('')
  const [projectCreationServerError, setProjectCreationServerError] = useState('')
  const [isCreateProjectButtonDisabled, setIsCreateProjectButtonDisabled] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    if (!isLogged) {
      Router.push('/')
    }
  }, [isLogged])

  useEffect(() => {
    (async function searchProjects () {
      setProjects([])
      setShowedProjects([])
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
        setShowedProjects(userProjects)
      } else {
        setIsProjectSearchingInProgress(false)
        setServerErrorMessage('Oops! Something went wrong! We can\'t search your projects but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    })()
  }, [])

  function filterProjects (name: string) {
    setFilterText(name)
    if (name.length >= 3) {
      const filteredProjects = projects.filter(p => p.name.includes(name))
      setShowedProjects(filteredProjects)
    } else {
      setShowedProjects(projects)
    }
  }

  async function createProject (e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault()
    setIsCreateProjectButtonDisabled(true)
    try {
      const request = new ProjectCreationControllerRequest(newProjectName)
      const session: string | null = getSession()
      const response = await fetch(
        '/api/projects/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-stockout-token': session === null ? '' : session
          },
          body: JSON.stringify(request)
        }
      )
      setIsCreateProjectButtonDisabled(false)
      if (response.status === 200) {
        // const successResponse: ResponseDto = await response.json()
        // projects.push(new Project(successResponse.projectId, newProjectName))
        // setProjects(projects);
        setIsNewProjectModalShown(false)
        setNewProjectName('')
      } else if (response.status === 401) {
        Router.push('/signin')
      } else if (response.status === 404) {
        const errorResponse: ErrorResponse = await response.json()
        if (errorResponse.validationErrors.length > 0) {
          errorResponse.validationErrors.forEach(error => {
            if (error.fieldId === 'name' && error.error === 'Required') {
              setProjectNameError('Name is required.')
            } else if (error.fieldId === 'name' && error.error === 'WrongLength') {
              setProjectNameError('The length of the name exceeds the allowed size.')
            }
          })
        } else {
          if (errorResponse.commandError === 'ProjectWithTheSameNameAlreadyExist') {
            setProjectCreationServerError('Another project with the same name already exists.')
          } else {
            setProjectCreationServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
          }
        }
      } else {
        setProjectCreationServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    } catch {
      setProjectCreationServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }
  }

  return (
    <Layout>
      <section>
        <div className='create-project-btn-container'>
            <Button
              text='New Project'
              onClickHandler={() => setIsNewProjectModalShown(true)}
              isDisabled={false}
              buttonInnerImgSrc={'/icons/plus.svg'}
              width='200px'
            />
          </div>

          <div className='project-list-container'>
            {
              isProjectSearchingInProgress && (
                <div className='spinner-container'>
                  <img src='/gifs/eclipse-blue.gif'></img>
                  <p>Searching projects...</p>
                </div>
              )
            }
            {
              showedProjects.length === 0 && !isProjectSearchingInProgress && (
                <div className='empty-list-container'>
                  <RocketIcon color={colors.black} width={100}/>
                  <h2>Create new project and start tracking your products!</h2>
                </div>
              )
            }
            {
              showedProjects.length > 0 && !isProjectSearchingInProgress && (
                <div className='table-container'>
                  <div className='filter-project-container'>
                    <input
                      type="text"
                      onChange={e => filterProjects(e.target.value)}
                      value={filterText}
                      className='field'>
                    </input>
                    <img className='magnifying-glass' src='/icons/search.svg'></img>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Project name</th>
                        <th style={{ width: '220px' }}>Products</th>
                        <th style={{ width: '220px' }}>Creation date</th>
                        <th style={{ width: '220px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        showedProjects.map(project => {
                          return (
                            <tr key={project.id}>
                              <td>
                                <ClientSideLink
                                  linkText={project.name}
                                  href=''
                                />
                              </td>
                              <td>1000</td>
                              <td>10/10/2020</td>
                              <td className='action-button'>
                                <Button
                                  text=''
                                  isDisabled={false}
                                  onClickHandler={() => new Error('not implemented')}
                                  buttonInnerImgSrc={'/icons/pencil.svg'}
                                  bgColor={colors.grey}
                                  width='150px'
                                />
                                <Button
                                  text=''
                                  isDisabled={false}
                                  onClickHandler={() => new Error('not implemented')}
                                  buttonInnerImgSrc={'/icons/trash.svg'}
                                  bgColor={colors.grey}
                                  width='150px'
                                />
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )
            }
            <ErrorMessage message={serverErrorMessage}/>
          </div>
      </section>
    <Modal
      isShown={isNewProjectModalShown}
      title='New Project'
      onClose={() => setIsNewProjectModalShown(false)}
    >
      <p className='create-project-modal__paragraph'>
        We recommend you use the domain name of your website,
        a project is used to group and organise your products.
      </p>
      <TextField
        title='Project name'
        isRequired={true}
        value={newProjectName}
        onChangeHandler={value => setNewProjectName(value)}
        errorMessage={projectNameError}
      />
      <Button
        text='Create'
        onClickHandler={createProject}
        isDisabled={isCreateProjectButtonDisabled}
      />
      <ErrorMessage message={projectCreationServerError}/>
    </Modal>
    <style jsx>{`
        section {
          height: 100%;
          margin: 0 20px;
        }

        .action-button {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .create-project-btn-container {
          display: flex;
          justify-content: end;
          margin-top: 20px;
          width: 100%;
        }

        .project-list-container {
          display: flex;
          width: 100%;
          height: 80%;
        }

        .empty-list-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 24px;
          font-family: ${fonts.base};
        }

        .spinner-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:center;
        }

        .spinner-container > img {
          width: 150px;
        }

        .spinner-container > p {
          margin-top: 10px;
          font-family: ${fonts.base};
        }

        .filter-project-container {
          text-align: end;
          margin-top: 20px;
        }

        .field { 
            font-family: ${fonts.base};
            color: ${colors.black};
            border: 1px solid #C4C2C2;
            font-size: 16px;
            padding: 0.25em 0.5em;
            border-radius: 5px;
            line-height: 1.5rem;
            margin-bottom: 10px;
        }

        .magnifying-glass {
            display: inline;
            margin-left: -37px;
            padding-top: 4px;
            background-color: ${colors.white};
            border: none;
            position: absolute;
            margin-top: 1px;
        }

        .table-container {
          width: 100%;
        }

        table {
          width: 100%;
          text-align: left;
          font-size: 18px;
          line-height: 1.5rem;
          font-family: ${fonts.base};
          background-color: ${colors.white};
        }

        thead {
          background-color: ${colors.black};
        }

        th {
          padding: 10px;
          height: 20px;
          color: ${colors.white};
        }

        td {
          padding: 10px;
        }

        tbody > tr {
          border-bottom: solid 1px ${colors.black}
        }

        .create-project-modal__paragraph {
          font-size: 18px;
          line-height: 1.5rem;
          font-family: ${fonts.base};
          max-width: 500px;
          margin-bottom: 20px;
        }
    `}</style>
    </Layout>
  )
}

export default Dashboard

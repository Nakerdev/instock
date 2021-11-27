import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect, useState, MouseEvent } from 'react';

import useSession from '../hooks/useSession'
import { colors, fonts } from '../styles/theme';
import Button from '../components/button/Button';
import RocketIcon from '../components/icons/Rocket';
import Modal from '../components/modal/Modal';
import TextField from '../components/textField/TextField';
import { ProjectCreationControllerRequest } from './api/projects/create/controller';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import { ErrorResponse } from './api/utils/apiUtils';

const Dashboard: NextPage = () => {

  //Create Project modal
  const [ isNewProjectModalShown, setIsNewProjectModalShown ] = useState(false)
  const [ newProjectName, setNewProjectName ] = useState('')
  const [ projectNameError, setProjectNameError ] = useState('')
  const [projectCreationServerError, setProjectCreationServerError ] = useState('')
  const [ isCreateProjectButtonDisabled, setIsCreateProjectButtonDisabled ] = useState(false)

  //Projects
  const [ projects, setProjects ] = useState<string[]>([])

  const { removeSession, getSession, isLogged } = useSession()

  useEffect(() => {
    if(!isLogged){
      Router.push('/');
    }
  }, [isLogged])

  async function createProject(e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    setIsCreateProjectButtonDisabled(true)
    try{
        const request = new ProjectCreationControllerRequest(newProjectName, JSON.stringify(false))
        const session: string | null = getSession()
        const response = await fetch(
            '/api/projects/create', 
            {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json',
                'x-stockout-token': session === null ? '' : session
              }, 
              body: JSON.stringify(request)}
        )
        setIsCreateProjectButtonDisabled(false)
        if(response.status === 200){
            projects.push(newProjectName)
            setProjects(projects);
            setIsNewProjectModalShown(false)
            setNewProjectName('')
        } else if (response.status === 401){
            Router.push('/signin')
        } else if (response.status === 404){

            const errorResponse: ErrorResponse  = await response.json();
            if(errorResponse.validationErrors.length > 0) {

                errorResponse.validationErrors.forEach(error => {

                    if(error.fieldId == 'name' && error.error == 'Required'){
                        setProjectNameError('Name is required.')
                    }else if(error.fieldId == 'name' && error.error == 'WrongLength'){
                        setProjectNameError('The length of the name exceeds the allowed size.')
                    }

                })

            } else {
                if(errorResponse.commandError == 'ProjectWithTheSameNameAlreadyExist') {
                    //TODO: controlar este error
                }else {
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
    <>
    <main>

      <aside>
        <h1>Stockout</h1>
        <div>
          {
            projects.map(project => <button>{project}</button>)
          }
        </div>
        <div className='actionButtonsContainer'>
          <Button 
            text='New Project' 
            onClickHandler={() => setIsNewProjectModalShown(true)} 
            isDisabled={false} 
          />
          <Button 
            text='Settings' 
            onClickHandler={() => {}} 
            bgColor={colors.grey} 
            isDisabled={false} 
            buttonInnerImgSrc='/icons/cogs.svg'
          />
          <Button 
            text='Logout' 
            onClickHandler={() => removeSession()} 
            bgColor={colors.grey} 
            isDisabled={false} 
            buttonInnerImgSrc='/icons/log-out.svg'
          /> 
        </div> 
      </aside>

      <section>
        <RocketIcon color={colors.black} width={100}/>
        <h2>Create new project and start tracking your products!</h2>
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

    </main>

    <style jsx>{`
        main {
            background-color: ${colors.background};
            height: 100vh;
            display: flex;
            flex-direction: row;
        }

        aside {
            background-color: ${colors.white};
            height: 100vh;
            width: 300px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px
        }

        h1 {
          font-size: 36px;
          padding-top: 20px;
          color: ${colors.black};
          text-shadow: 2px 3px 3px rgba(0,0,0,0.3);
          font-family: ${fonts.base};
          margin-bottom: 20px;
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

        .actionButtonsContainer {
          width: 100%;
          padding-bottom: 20px
        }

        .create-project-modal__paragraph {
          font-size: 18px;
          line-height: 1.5rem;
          font-family: ${fonts.base};
          max-width: 500px;
          margin-bottom: 20px;
        }

    `}</style>
    </>
  )
}

export default Dashboard

import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import useSession from '../../hooks/useSession'
import Layout from '../../components/layout/Layout'
import ClientSideLink from '../../components/clientSideLink/ClientSideLink'
import { colors, fonts } from '../../styles/theme'
import { ProjectDto } from '../api/projects/products/search/controller'
import Button from '../../components/button/Button'
import Modal from '../../components/modal/Modal'
import TextField from '../../components/textField/TextField'
import ErrorMessage from '../../components/errorMessage/ErrorMessage'
import TextArea from '../../components/textArea/TextArea'

const ProjectPage: NextPage = () => {

  const router = useRouter()
  const { isLogged, getSession } = useSession()
  const [ project, setProject ] = useState<ProjectDto | null> (null)
  const [ serverErrorMessage, setServerErrorMessage ] = useState('')
  const [ isProductsSearchingInProgress, setIsProductsSearchingInProgress ] = useState(false)
  const [ filterText, setFilterText ] = useState('')
  const [ isAttachProductsToProjectModalShown, setIsAttachProductsToProjectModalShown ] = useState(false)

  const { projectId } = router.query;
  
  useEffect(() => {
    if (!isLogged) {
      Router.push('/')
    }
  }, [isLogged])

  useEffect(() => {
    (async function searchProjects () {
      setProject(null)
      setServerErrorMessage('')
      setIsProductsSearchingInProgress(true)
      const session: string | null = getSession()
      const response = await fetch(
         `/api/projects/products/search?projectId=${projectId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-stockout-token': session === null ? '' : session
          }
        }
      )
      if (response.status === 200 || response.status === 304) {
        setIsProductsSearchingInProgress(false)
        const project: ProjectDto = await response.json()
        setProject(project)
      } else {
        setIsProductsSearchingInProgress(false)
        setServerErrorMessage('Oops! Something went wrong! We can\'t search your products but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    })()
  }, [projectId])

  function filterProducts (name: string) {
    setFilterText(name)
    if (name.length >= 3) {
      //const filteredProjects = projects.filter(p => p.name.includes(name))
      //setShowedProjects(filteredProjects)
    } else {
      //setShowedProjects(projects)
    }
  }

  return (
    <Layout pageTitle={project ? project.name : 'Project'}>
      <section>
        <ClientSideLink
          linkText='Back to projects list'
          href='/projects'
          imgSrc='/icons/arrow-circle-left.f.svg'
        />
        <div className='products-list-container'>
          {
            project && (
              <h2>{project.name}</h2>
            )
          }
          <div className='create-product-btn-container'>
            <Button
              text='New Product'
              onClickHandler={() => setIsAttachProductsToProjectModalShown(true)}
              isDisabled={false}
              buttonInnerImgSrc={'/icons/plus.svg'}
              width='200px'
            />
          </div>
          {
              !isProductsSearchingInProgress && (
                <div className='table-container'>
                  <div className='filter-project-container'>
                    <input
                      type="text"
                      onChange={e => filterProducts(e.target.value)}
                      value={filterText}
                      className='field'>
                    </input>
                    <img className='magnifying-glass' src='/icons/search.svg'></img>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Product id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        //showedProjects.length === 0 && <p className='not-projects-found'>No projects found</p>
                      }
                      {
                        project?.products.map(product => {
                          return (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td className='action-button'>
                                <Button
                                  text=''
                                  isDisabled={false}
                                  onClickHandler={() => {}}
                                  buttonInnerImgSrc={'/icons/trash.svg'}
                                  bgColor={colors.grey}
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
          {
            isProductsSearchingInProgress && (
              <div className='spinner-container'>
                <img src='/gifs/eclipse-blue.gif'></img>
                <p>Searching products...</p>
              </div>
            )
          }
        </div>
      </section>
      <Modal
        isShown={isAttachProductsToProjectModalShown}
        title='Create Products'
        onClose={() => setIsAttachProductsToProjectModalShown(false)}
      >
        <p className='modal-paragraph'>
          Use Amazon Standard Identification Number (ASIN) to create the product.
        </p>
        <p className='modal-paragraph'>
          If you would like to create more than one product at the same time use 
          comma to split multiple ASIN.
        </p>
        <TextArea
          title='ASIN'
          isRequired={true}
          value=''
          onChangeHandler={() => {}}
          errorMessage=''
          placeholder='B0837F9CZW,B07FWTKXJM,...'
        />
        <Button
          text='Create'
          onClickHandler={() => {}}
          isDisabled={false}
        />
        <ErrorMessage message=''/>
      </Modal>
      <style jsx>{`
          section {
            height: 100%;
            margin: 0 20px;
            background-color: ${colors.background}
          }

          h2 {
            font-family: ${fonts.base};
            font-size: 24px;
            margin-right: 20px;
          }

          .modal-paragraph {
            font-size: 18px;
            line-height: 1.5rem;
            font-family: ${fonts.base};
            max-width: 500px;
            margin-bottom: 20px;
          }

          .create-product-btn-container {
            display: flex;
            justify-content: end;
            margin-top: 20px;
            width: 100%;
          }

          .products-list-container {
            display: flex;
            width: 100%;
            height: 80%;
            flex-direction: column;
          }

          .spinner-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content:center;
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
            height: 40px;
            color: ${colors.white};
          }

          td {
            padding: 10px;
          }

          tbody > tr {
            border-bottom: solid 1px ${colors.black}
          }
      `}</style>
    </Layout>
  )
}

export default ProjectPage

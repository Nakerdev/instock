import { NextPage } from 'next'
import Router, { useRouter } from 'next/router'
import { useEffect, useState, MouseEvent } from 'react'

import useSession from '../../hooks/useSession'
import Layout from '../../components/layout/Layout'
import ClientSideLink from '../../components/clientSideLink/ClientSideLink'
import { colors, fonts } from '../../styles/theme'
import { ProjectDto, ProductDto } from '../api/projects/products/search/controller'
import Button from '../../components/button/Button'
import Modal from '../../components/modal/Modal'
import ErrorMessage from '../../components/errorMessage/ErrorMessage'
import TextArea from '../../components/textArea/TextArea'
import { AttachProductsInBulkControllerRequest } from '../api/projects/products/attach/bulk/controller'
import { ErrorResponse } from '../api/utils/apiUtils'
import { DeleteProductsInBulkControllerRequest } from '../api/projects/products/delete/bulk/controller'

const ProjectPage: NextPage = () => {

  const router = useRouter()
  const { isLogged, getSession } = useSession()
  const [ project, setProject ] = useState<ProjectDto | null> (null)
  const [ serverErrorMessage, setServerErrorMessage ] = useState('') //TODO usar esto.
  const [ isProductsSearchingInProgress, setIsProductsSearchingInProgress ] = useState(false)
  const [ filterText, setFilterText ] = useState('')
  const [ isAttachProductsToProjectModalShown, setIsAttachProductsToProjectModalShown ] = useState(false)
  const [ isCreateProductButtonDisabled, setIsCreateProductButtonDisabled ] = useState(false)
  const [ productsSplittedByComma, setProductsSplittedByComma ] = useState('')
  const [ productsToCreateError, setProductsToCreateError ] = useState('')
  const [ productsCreationServerError, setProductsCreationServerError ] = useState('')
  const [ isDeleteProjectModalShown, setIsDeleteProjectModalShown  ] = useState(false)
  const [ selectedProductToDelete, setSelectedProductToDelete ] = useState<ProductDto | null>(null)
  const [ isDeleteProductConfirmationButtonDisabled, setIsDeleteProductConfirmationButtonDisabled ] = useState(false)
  const [ isDeleteProductCancellationButtonDisabled, setIsDeleteProductCancellationButtonDisabled ] = useState(false)
  const [ productDeletionServerError, setProductDeletionServerError ] = useState('')

  const { projectId } = router.query;
  
  useEffect(() => {
    if (!isLogged) {
      Router.push('/')
    }
  }, [isLogged])

  useEffect(() => {
    searchProjects()
  }, [projectId])

  async function searchProjects () {
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
      setProductsSplittedByComma('')
      const project: ProjectDto = await response.json()
      setProject(project)
    } else {
      setIsProductsSearchingInProgress(false)
      setServerErrorMessage('Oops! Something went wrong! We can\'t search your products but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }
  }

  async function attachProductsToProject (e: MouseEvent<HTMLElement>): Promise<void> {
    e.preventDefault()
    setIsCreateProductButtonDisabled(true)
    setProductsCreationServerError('')
    setProductsToCreateError('')
    try {
      let productsId: string[] = [];
      if(productsSplittedByComma.length === 10){
        productsId.push(productsSplittedByComma)
      } else if (productsSplittedByComma.length > 10 && productsSplittedByComma.includes(',')) {
        productsId = (productsSplittedByComma.trim().split(',').filter(x => x !== ''))
      } else {
        setProductsToCreateError('Please, be sure all ASIN are valid and all of then are separated by comma.')
        setIsCreateProductButtonDisabled(false)
      }
      if(productsId.length === 0) return;
      const request = new AttachProductsInBulkControllerRequest(projectId, productsId)
      const session: string | null = getSession()
      const response = await fetch(
        '/api/projects/products/attach/bulk',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-stockout-token': session === null ? '' : session
          },
          body: JSON.stringify(request)
        }
      )
      setIsCreateProductButtonDisabled(false)
      if (response.status === 200) {
        searchProjects();
        setIsAttachProductsToProjectModalShown(false)
      } else if (response.status === 401) {
        Router.push('/signin')
      } else if (response.status === 400) {
        const errorResponse: ErrorResponse = await response.json()
        if (errorResponse.validationErrors.length > 0) {
          errorResponse.validationErrors.forEach(error => {
            if (error.fieldId === 'productsId') {
              setProductsToCreateError('At least one ASIN is required.')
            }
          })
        } else {
            setProductsCreationServerError('Another project with the same name already exists.')
        }
      } else {
        setProductsCreationServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    } catch {
      setProductsCreationServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }
  }

  function deleteProject(product: ProductDto): Function {
    setSelectedProductToDelete(product)
    setIsDeleteProjectModalShown(true)

    return async function deleteProjectAux(event: MouseEvent<HTMLElement>): Promise<void> {
      event.preventDefault()
    }
  }
  async function cancelProjectDeletion(): Promise<void> {
    setSelectedProductToDelete(null)
    setIsDeleteProjectModalShown(false)
  }

  async function confirmProductDeletion(event: MouseEvent<HTMLElement>): Promise<void> {
      event.preventDefault()
      setIsDeleteProductConfirmationButtonDisabled(true)
      setIsDeleteProductCancellationButtonDisabled(true)
      try {
        const productIdToDelete = selectedProductToDelete ? selectedProductToDelete.id : ''
        const request = new DeleteProductsInBulkControllerRequest(projectId, [productIdToDelete])
        const session: string | null = getSession()
        const response = await fetch(
          '/api/projects/products/delete/bulk',
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-stockout-token': session === null ? '' : session
            },
            body: JSON.stringify(request)
          }
        )
        setIsDeleteProductConfirmationButtonDisabled(false)
        setIsDeleteProductCancellationButtonDisabled(false)
        if (response.status === 200) {
          if(!project) return;
          const productsWithoutDeletedOne = project?.products.filter(p => p.id !== productIdToDelete)
          setProject(new ProjectDto(project.name, productsWithoutDeletedOne));
          setSelectedProductToDelete(null)
          setIsDeleteProjectModalShown(false)
        } else if (response.status === 401) {
          Router.push('/signin')
        } else {
          setProductDeletionServerError('Oops! Something went wrong deleting a product! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
        }
      } catch {
        setProductDeletionServerError('Oops! Something went wrong deleting a product! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
  }

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
                        <th>ASIN</th>
                        <th></th>
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
                                  onClickHandler={() => deleteProject(product)}
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
        maxWidth='500px'
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
          value={productsSplittedByComma}
          onChangeHandler={value => setProductsSplittedByComma(value)}
          errorMessage={productsToCreateError}
          placeholder='B0837F9CZW,B07FWTKXJM,...'
          resize='vertical'
        />
        <Button
          text='Create'
          onClickHandler={attachProductsToProject}
          isDisabled={isCreateProductButtonDisabled}
        />
        <ErrorMessage message={productsCreationServerError}/>
      </Modal>
      <Modal
        isShown={isDeleteProjectModalShown}
        title='Delete Product'
        onClose={() => cancelProjectDeletion()}
      >
        <p className='modal-paragraph'>
          Are you sure you want to the product?
        </p>
        <div className='delete-product-modal-button'>
          <Button
            text='Yes'
            onClickHandler={confirmProductDeletion}
            isDisabled={isDeleteProductConfirmationButtonDisabled}
            bgColor={colors.green}
            textColor={colors.white}
            width='170px'
          />
          <Button
            text='No'
            onClickHandler={cancelProjectDeletion}
            isDisabled={isDeleteProductCancellationButtonDisabled}
            bgColor={colors.error}
            textColor={colors.white}
            width='170px'
            avoidSpinnerOnDisabledMode={true}
          />
        </div>
        <ErrorMessage message={productDeletionServerError}/>
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

          .delete-product-modal-button {
            display: flex;
            justify-content:space-between;
          }
      `}</style>
    </Layout>
  )
}

export default ProjectPage

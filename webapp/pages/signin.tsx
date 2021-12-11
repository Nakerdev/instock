import { NextPage } from 'next'
import { useState, MouseEvent, useEffect } from 'react'
import Router from 'next/router'

import { colors } from '../styles/theme'
import { UserLoginControllerRequest, ResponseDto } from './api/users/login/controller'
import Button from '../components/button/Button'
import PasswordField from '../components/paswordField/PasswordField'
import TextField from '../components/textField/TextField'
import ClientSideLink from '../components/clientSideLink/ClientSideLink'
import ErrorMessage from '../components/errorMessage/ErrorMessage'
import Form from '../components/form/Form'
import Layout from '../components/layout/Layout'

import useSession from '../hooks/useSession'

const Signin: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState('')
  const { setSession, isLogged } = useSession()
  const [isLoginBtnDisabled, setIsLoginBtnDisabled] = useState(false)

  useEffect(() => {
    if (isLogged) {
      Router.push('/projects')
    }
  }, [isLogged])

  async function login (e: MouseEvent<HTMLElement>) {
    e.preventDefault()
    setIsLoginBtnDisabled(true)
    cleanErrors()
    const request = new UserLoginControllerRequest(
      email,
      password
    )
    try {
      const response = await fetch(
        '/api/users/login',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) }
      )
      if (response.status === 200) {
        const successResponse: ResponseDto = await response.json()
        setSession(successResponse.token)
      } else if (response.status === 401) {
        setServerError('Invalid credentials.')
      } else {
        setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
      }
    } catch {
      setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }

    setIsLoginBtnDisabled(false)
  }

  function cleanErrors (): void {
    setServerError('')
  }

  return (
    <>
      <Layout>
        <section>
            <Form>
                <TextField
                    title='Email'
                    isRequired={false}
                    value={email}
                    onChangeHandler={value => setEmail(value)}
                />
                <PasswordField
                    title='Password'
                    isRequired={false}
                    value={password}
                    onChangeHandler={value => setPassword(value)}
                    helperText='Forgot password?'
                    helperLink='/forgot-password'
                />
                <Button
                    text='Sign in'
                    onClickHandler={e => login(e)}
                    isDisabled={isLoginBtnDisabled}
                    buttonInnerImgSrc='/icons/key-f.svg'
                />
                <ErrorMessage message={serverError}/>
                <ClientSideLink
                    text='New to Stockout?'
                    href='/signup'
                    linkText='Create an account'
                />
            </Form>
        </section>
      </Layout>
      <style jsx>{`
        section {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
      `}</style>
    </>
  )
}

export default Signin

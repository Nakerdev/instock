import { NextPage } from 'next'
import { useState, MouseEvent } from 'react'
import Router from 'next/router'

import { colors } from '../styles/theme'
import { UserLoginControllerRequest, ResponseDto } from './api/users/login/controller'
import Link from 'next/link'
import CTA from '../components/cta/CTA'
import PasswordField from '../components/paswordField/PasswordField'
import TextField from '../components/textField/TextField'
import ClientSideLink from '../components/clientSideLink/ClientSideLink'
import ErrorMessage from '../components/errorMessage/ErrorMessage'

const Login: NextPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');

  const [isLoginBtnDisabled, setIsLoginBtnDisabled] = useState(false);

  async function login(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setIsLoginBtnDisabled(true)
    cleanErrors()
    const request = new UserLoginControllerRequest(
        email,
        password
    );
    try{

        const response = await fetch(
            '/api/users/login', 
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)}
        )
        if(response.status === 200){
            const successResponse: ResponseDto = await response.json()
            localStorage.removeItem('session-token')
            localStorage.setItem('session-token', successResponse.token)
            Router.push("/dashboard")
        } else if (response.status === 401){
            setServerError('Invalid credentials.')
        } else {
            setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
        }
    } catch {
        setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }

    setIsLoginBtnDisabled(false)
  }

  function cleanErrors(): void {
      setServerError('')
  }

  return (
    <>
      <main>
        <form>
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
            <CTA 
                text='Login'
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
        </form>
      </main>
    <style jsx>{`
        main {
            background-color: ${colors.background};
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        form {
            left: 0;
            right: 0;
            position: absolute;
            margin: 20px;
            background-color: ${colors.white};
            flex: 1;
            border: 1px solid ${colors.white};
            border-radius: 10px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            padding: 25px;
        }

        @media (min-width: 600px) {
            form {
                min-width: 500px;
                max-width: 500px;
            }
        }

    `}</style>
    </>
  )
}

export default Login

import { NextPage } from 'next'
import Link from 'next/link'
import { useState, MouseEvent } from 'react'

import { colors } from '../styles/theme'
import { UserPasswordRecoveryControllerRequest } from './api/users/password/recovery/controller'
import CTA from '../components/cta/CTA'
import TextField from '../components/textField/TextField'

const ForgotPassword: NextPage = () => {

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [hasEmailToResetPasswordBeenSent, setHasEmailToResetPasswordBeenSent] = useState(false);

  const [isRecoveryBtnDisabled, setIsRecoveryBtnDisabled] = useState(false);

  async function recovery(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    cleanErrors()
    if(!email){
      setEmailError('Email is required.')
      return;
    }
    setIsRecoveryBtnDisabled(true)
    const request = new UserPasswordRecoveryControllerRequest(
        email
    );
    try{
        const response = await fetch(
            '/api/users/password/recovery', 
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)}
        )
        if(response.status === 200){
          setHasEmailToResetPasswordBeenSent(true)
        } else {
            setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
        }
    } catch {
        setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }
    setIsRecoveryBtnDisabled(false)
  }

  function cleanErrors(){
    setEmailError('')
    setServerError('')
  }

  return (
    <>
      <main>
        <form >
            <h2>Reset your password</h2>
            <h3>Enter your user account's verified email address and we will send you a password reset link.</h3>
            <div style={hasEmailToResetPasswordBeenSent ? {display: 'none'} : {display: 'block'}}>
              <TextField
                  title='Email'
                  isRequired={true}
                  value={name}
                  onChangeHandler={value => setEmail(value)}
                  errorMessage={emailError}
              />
              <CTA 
                  text='Send password reset email'
                  onClickHandler={e => recovery(e)}
                  isDisabled={isRecoveryBtnDisabled}
              />
              <p className="error" style={serverError ? {display: 'block'} : {display: 'none'}}>{serverError}</p>
            </div>
            <div style={hasEmailToResetPasswordBeenSent ? {display: 'block'} : {display: 'none'}}>
              <p className='success-message'>
                Check your email for a link to reset your password. 
                If it doesn’t appear within a few minutes, check your spam folder. 
              </p>
              <p className='goToLoginPage'>Go to <Link href='/login'><a className='link'>Login Page</a></Link></p>
            </div>
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
            min-width: 500px;
            max-width: 500px;
            position: absolute;
            margin-top: 20px;
            margin-bottom: 20px;
            background-color: ${colors.white};
            flex: 1;
            border: 1px solid ${colors.white};
            border-radius: 10px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            padding: 25px;
        }

        h2 {
            color: ${colors.black};
            font-size: 20px;
            text-align: center;
            margin-bottom: 10px;
        }

        h3 {
            color: ${colors.grey};
            font-size: 16px;
            margin-bottom: 10px;
            line-height: 1.3rem;
        }

        .success-message {
          background-color: ${colors.success};
          border-radius: 5px;
          padding: 15px;
          color: ${colors.black};
          line-height: 1.3rem
        }

        .error {
            color: ${colors.error};
            margin-top: 5px;
            margin-left: 2px;
            margin-bottom: 5px;
            line-height: 1.2rem;
        }

        .goToLoginPage {
            margin-top: 20px;
            color: ${colors.black};
            font-size: 16px;
        }

        .link {
            color: ${colors.link};
            font-weight: bold;
            cursor: pointer;
        }
    `}</style>
    </>
  )

}

export default ForgotPassword

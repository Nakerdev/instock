import { NextPage, NextApiResponse } from 'next'
import Link from 'next/link'
import { useState, MouseEvent } from 'react'

import { colors } from '../styles/theme'
import { UserChangePasswordControllerRequest } from './api/users/password/change/controller'
import { ErrorResponse } from './api/utils/apiUtils';

interface Context {
	query: {
		t: string
    },
    res: NextApiResponse
}

class ServerSideProps {
    readonly token: string;

    constructor(token: string){
        this.token = token
    }
}

export async function getServerSideProps(context: Context) {
    if(!context.query.t){
        context.res.writeHead(301, { Location: '/' })
        context.res.end()
    }
    return { props: { token: context.query.t } }
}

const ChangePassword: NextPage = (props: ServerSideProps) => {

  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasPasswordBeenChanged, setHasPasswordBeenChanged] = useState(false);

  const [serverError, setServerError] = useState('');

  const [isChangePasswordBtnDisabled, setIsChangePasswordBtnDisabled] = useState(false);

  async function changePassword(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    cleanErrors()

    if(password !== repeatedPassword) {
        setPasswordError('Passwords are not the same.')
        return;
    }

    setIsChangePasswordBtnDisabled(true)
    const request = new UserChangePasswordControllerRequest(
        props.token,
        password
    );
    try{

        const response = await fetch(
            '/api/users/password/change', 
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)}
        )
        if(response.status === 200){
          setHasPasswordBeenChanged(true)
        } else if (response.status === 404){

            const errorResponse: ErrorResponse  = await response.json();
            if(errorResponse.validationErrors.length > 0) {
                errorResponse.validationErrors.forEach(error => {

                    if(error.fieldId == 'userId'){
                        setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
                    }

                    if(error.fieldId == 'password' && error.error == 'InvalidFormat'){
                        setPasswordError(`Password does not comply our security policy. Please use 8 or more characters, at least one uppercase letter, at least one number and at least one simbol.`)
                    }else if(error.fieldId == 'password' && error.error == 'WrongLength'){
                        setPasswordError('The length of the password exceeds the allowed size.')
                    }

                })

            } else {
                if(errorResponse.commandError == 'UserNotFound') {
                    setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
                } else if(errorResponse.commandError == 'PasswordChangePetitionExpired') {
                    setServerError('The password change period has expired, please re-apply to change your password.')
                }
                else {
                    setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
                }
            }

        } else {
            setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
        }

    } catch {
        setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }

    setIsChangePasswordBtnDisabled(false)
  }

  function cleanErrors(): void {
      setPasswordError('')
      setServerError('')
  }

  return (
    <>
      <main>
        <form >
            <h2>Reset your password</h2>
            <div style={hasPasswordBeenChanged ? {display: 'none'} : {display: 'block'}}>
              <fieldset>
                  <label>Password</label>
                  <input 
                      type="password" 
                      onChange={e => setPassword(e.target.value)} 
                      value={password} 
                      className={`field ${passwordError ? 'field-error' : ''}`}>
                  </input>
              </fieldset>
              <fieldset>
                  <label>Repeate password</label>
                  <input 
                      type="password" 
                      onChange={e => setRepeatedPassword(e.target.value)} 
                      value={repeatedPassword} 
                      className={`field ${passwordError ? 'field-error' : ''}`}>
                  </input>
                  <p className="error" style={passwordError ? {display: 'block'} : {display: 'none'}}>{passwordError}</p>
              </fieldset>
              <button className="cta" onClick={e => changePassword(e)} disabled={isChangePasswordBtnDisabled}>
                  {
                      isChangePasswordBtnDisabled
                          ? <img src='/gifs/eclipse-white.gif'></img>
                          : <span>Change password</span>
                  }
              </button>
              <p className="error" style={serverError ? {display: 'block'} : {display: 'none'}}>{serverError}</p>
            </div>
            <div style={hasPasswordBeenChanged ? {display: 'block'} : {display: 'none'}}>
              <p className='success-message'>
                  Your password was successfully changed.
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

        fieldset {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }

        fieldset > label {
            margin-bottom: 10px;
            color: ${colors.black};
        }

        fieldset > label > span {
            color: ${colors.grey};
            font-size: 14px
        }

        fieldset > div {
            width: 100%;
        }

        .success-message {
          background-color: ${colors.success};
          border-radius: 5px;
          padding: 15px;
          color: ${colors.black};
          line-height: 1.3rem
        }

        .field {
            color: ${colors.black};
            border: 1px solid #C4C2C2;
            font-size: 16px;
            padding: 0.25em 0.5em;
            border-radius: 5px;
            line-height: 25px
        }

        .field:focus {
            outline: none
        }

        .cta {
            color: ${colors.white};
            background-color: ${colors.CTA};
            width: 100%;
            height: 50px;
            border: 0;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
            margin-bottom: 5px;
        }

        .cta:disabled  {
            cursor: wait;
            opacity: 80%;
        }

        .cta:disabled > img {
            width: 30px;
        }

        .cta > span > img {
            filter: invert(1);
            position: absolute;
            margin-left: -30px;
            margin-top: -3px;
        }

        .field-error {
            border: 1px solid ${colors.error}
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

export default ChangePassword

import { NextPage } from 'next'
import { useState, MouseEvent } from 'react'
import Router from 'next/router'

import { colors } from '../styles/theme'
import { UserSignUpControllerRequest, ResponseDto } from './api/users/signup/controller'
import { ErrorResponse } from './api/utils/apiUtils'

const SignUp: NextPage = () => {

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [surname, setSurname] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [areTermsAndConditionsAccepted, setAreTermsAndConditionsAccepted] = useState(false);
  const [termsAndConditionsError, setTermsAndConditionsError] = useState('');

  const [serverError, setServerError] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignUpBtnDisabled, setIsSignUpBtnDisabled] = useState(false);

  async function signup(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setIsSignUpBtnDisabled(true)
    cleanErrors()
    const request = new UserSignUpControllerRequest(
        email,
        password,
        name,
        surname,
        areTermsAndConditionsAccepted
    );
    try{

        const response = await fetch(
            '/api/users/signup', 
            {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)}
        )
        if(response.status === 200){

            const successResponse: ResponseDto = await response.json()
            localStorage.removeItem('session-token')
            localStorage.setItem('session-token', successResponse.token)
            Router.push("/dashboard")
            
        } else if (response.status === 404){

            const errorResponse: ErrorResponse  = await response.json();
            if(errorResponse.validationErrors.length > 0) {
                errorResponse.validationErrors.forEach(error => {

                    if(error.fieldId == 'email' && error.error == 'Required'){
                        setEmailError('Email is required.')
                    }else if(error.fieldId == 'email' && error.error == 'InvalidFormat'){
                        setEmailError('Email format is invalid.')
                    }else if(error.fieldId == 'email' && error.error == 'WrongLength'){
                        setEmailError('The length of the email exceeds the allowed size.')
                    }

                    if(error.fieldId == 'name' && error.error == 'Required'){
                        setNameError('Name is required.')
                    }else if(error.fieldId == 'name' && error.error == 'WrongLength'){
                        setNameError('The length of the name exceeds the allowed size.')
                    }

                    if(error.fieldId == 'surname' && error.error == 'Required'){
                        setSurnameError('Surname is required.')
                    }else if(error.fieldId == 'surname' && error.error == 'WrongLength'){
                        setSurnameError('The length of the surname exceeds the allowed size.')
                    }

                    if(error.fieldId == 'password' && error.error == 'Required'){
                        setPasswordError('Password is required.')
                    }else if(error.fieldId == 'password' && error.error == 'InvalidFormat'){
                        setPasswordError(`Password does not comply our security policy. Please use 8 or more characters, at least one uppercase letter and at least one simbol.`)
                    }else if(error.fieldId == 'password' && error.error == 'WrongLength'){
                        setPasswordError('The length of the password exceeds the allowed size.')
                    }

                    if(error.fieldId == 'legalTermsAndConditions' && error.error == 'Required'){
                        setTermsAndConditionsError('Terms and conditions must be accepted.');
                    }
                })
            } else {
                if(errorResponse.commandError == 'UserAlreadyExist') {
                    setServerError('We already have a registered user with the same email address.')
                }else {
                    setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
                }
            }

        } else {
            setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
        }

    } catch {
        setServerError('Oops! Something went wrong! It doesn\'t appear to have affected your data, but our technical staff have been automatically notified and will be looking into this with the utmost urgency.')
    }

    setIsSignUpBtnDisabled(false)
  }

  function cleanErrors(): void {
      setNameError('')
      setSurnameError('')
      setEmailError('')
      setPasswordError('')
      setTermsAndConditionsError('')
      setServerError('')
  }

  function showPassword(e: MouseEvent<HTMLElement>): void {
      e.preventDefault();
      setIsPasswordVisible(true);
  }

  function hidePassword(e: MouseEvent<HTMLElement>): void {
      e.preventDefault();
      setIsPasswordVisible(false);
  }

  return (
    <>
      <main>
        <form>
            <fieldset>
                <label>Name <span>- required</span></label>
                <input 
                    type="text" 
                    onChange={e => setName(e.target.value)} 
                    value={name} 
                    className={`field ${nameError ? 'field-error' : ''}`}>
                </input>
                <p className="error" style={nameError ? {display: 'block'} : {display: 'none'}}>{nameError}</p>
            </fieldset>
            <fieldset>
                <label>Surname <span>- required</span></label>
                <input 
                    type="text" 
                    onChange={e => setSurname(e.target.value)} 
                    value={surname} 
                    className={`field ${surnameError ? 'field-error' : ''}`}>
                </input>
                <p className="error" style={surnameError ? {display: 'block'} : {display: 'none'}}>{surnameError}</p>
            </fieldset>
            <fieldset>
                <label>Email <span>- required</span></label>
                <input 
                    type="text" 
                    onChange={e => setEmail(e.target.value)} 
                    value={email} 
                    className={`field ${emailError ? 'field-error' : ''}`}>
                </input>
                <p className="error" style={emailError ? {display: 'block'} : {display: 'none'}}>{emailError}</p>
            </fieldset>
            <fieldset>
                <label>Password <span>- required</span></label>
                <div>
                    {
                        isPasswordVisible
                            ? <input 
                                type="text" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className={`password field ${passwordError ? 'field-error' : ''}`}>
                              </input>
                            : <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className={`password field ${passwordError ? 'field-error' : ''}`}>
                              </input>
                    }
                    {
                        isPasswordVisible
                            ? <button 
                                className="eye" 
                                onClick={e => hidePassword(e)}
                              >
                                  <img src='/icons/eye-close-f.svg'></img>
                              </button>
                            : <button 
                                className="eye" 
                                onClick={e => showPassword(e)}
                              >
                                <img src='/icons/eye-f.svg'></img>
                              </button>
                    }
                    <p className="error" style={passwordError ? {display: 'block'} : {display: 'none'}}>{passwordError}</p>
                </div>
            </fieldset>
            <fieldset>
                <div className='termsAndConditionsContainer'>
                    <input 
                        type="checkbox" 
                        onChange={e => setAreTermsAndConditionsAccepted(e.target.checked)} 
                        checked={areTermsAndConditionsAccepted}>
                    </input>
                    <label>
                        I agree to the <a href='/terms-and-conditions' target='_blank'> Terms and Conditions</a>
                    </label>
                </div>
                <p className="error" style={termsAndConditionsError ? {display: 'block'} : {display: 'none'}}>{termsAndConditionsError}</p>
            </fieldset>
            <button className="cta" onClick={e => signup(e)} disabled={isSignUpBtnDisabled}>
                {
                    isSignUpBtnDisabled
                        ? <img src='/gifs/eclipse-white.gif'></img>
                        : <span><img src='/icons/padlock-f.svg'></img>Create Account</span>
                }
            </button>
            <p className="error" style={serverError ? {display: 'block'} : {display: 'none'}}>{serverError}</p>
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
            background-color: ${colors.white};
            flex: 1;
            border: 1px solid ${colors.white};
            border-radius: 10px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            padding: 25px;
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

        .field-error {
            border: 1px solid ${colors.error}
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

        .password {
            width: 100%;
            padding-right: 50px;
        }

        .eye {
            display: inline;
            margin-left: -37px;
            padding-top: 4px;
            background-color: ${colors.white};
            border: none;
            position: absolute;
            margin-top: 1px;
            cursor: pointer;
        }

        .error {
            color: ${colors.error};
            margin-top: 5px;
            margin-left: 2px;
            margin-bottom: 5px;
            line-height: 1.2rem;
        }

        .termsAndConditionsContainer {
            display: inline;
        }

        .termsAndConditionsContainer > input {
            margin-right: 10px;
        }

        .termsAndConditionsContainer > label > a {
            color: ${colors.link};
            font-weight: bold;
            cursor: pointer;
        }

    `}</style>
    </>
  )
}

export default SignUp

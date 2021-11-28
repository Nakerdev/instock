import { NextPage } from 'next'
import { useState, MouseEvent, useEffect } from 'react'
import Router from 'next/router'

import { colors } from '../styles/theme'
import { UserSignUpControllerRequest, ResponseDto } from './api/users/signup/controller'
import { ErrorResponse } from './api/utils/apiUtils'
import Button from '../components/button/Button'
import TextField from '../components/textField/TextField'
import PasswordField from '../components/paswordField/PasswordField'
import ClientSideLink from '../components/clientSideLink/ClientSideLink'
import ErrorMessage from '../components/errorMessage/ErrorMessage'
import Form from '../components/form/Form'
import Layout from '../components/layout/Layout'

import useSession from '../hooks/useSession'

const SignUp: NextPage = () => {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [surname, setSurname] = useState('')
  const [surnameError, setSurnameError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [areTermsAndConditionsAccepted, setAreTermsAndConditionsAccepted] = useState(false)
  const [termsAndConditionsError, setTermsAndConditionsError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSignUpBtnDisabled, setIsSignUpBtnDisabled] = useState(false)
  const { setSession, isLogged } = useSession()

  useEffect(() => {
    if (isLogged) {
      Router.push('/dashboard')
    }
  }, [isLogged])

  async function signup (e: MouseEvent<HTMLElement>) {
    e.preventDefault()
    setIsSignUpBtnDisabled(true)
    cleanErrors()
    const request = new UserSignUpControllerRequest(
      email,
      password,
      name,
      surname,
      JSON.stringify(areTermsAndConditionsAccepted)
    )
    try {
      const response = await fetch(
        '/api/users/signup',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) }
      )
      if (response.status === 200) {
        const successResponse: ResponseDto = await response.json()
        setSession(successResponse.token)
      } else if (response.status === 404) {
        const errorResponse: ErrorResponse = await response.json()
        if (errorResponse.validationErrors.length > 0) {
          errorResponse.validationErrors.forEach(error => {
            if (error.fieldId === 'email' && error.error === 'Required') {
              setEmailError('Email is required.')
            } else if (error.fieldId === 'email' && error.error === 'InvalidFormat') {
              setEmailError('Email format is invalid.')
            } else if (error.fieldId === 'email' && error.error === 'WrongLength') {
              setEmailError('The length of the email exceeds the allowed size.')
            }

            if (error.fieldId === 'name' && error.error === 'Required') {
              setNameError('Name is required.')
            } else if (error.fieldId === 'name' && error.error === 'WrongLength') {
              setNameError('The length of the name exceeds the allowed size.')
            }

            if (error.fieldId === 'surname' && error.error === 'Required') {
              setSurnameError('Surname is required.')
            } else if (error.fieldId === 'surname' && error.error === 'WrongLength') {
              setSurnameError('The length of the surname exceeds the allowed size.')
            }

            if (error.fieldId === 'password' && error.error === 'Required') {
              setPasswordError('Password is required.')
            } else if (error.fieldId === 'password' && error.error === 'InvalidFormat') {
              setPasswordError('Password does not comply our security policy. Please use 8 or more characters, at least one uppercase letter, at least one number and at least one simbol.')
            } else if (error.fieldId === 'password' && error.error === 'WrongLength') {
              setPasswordError('The length of the password exceeds the allowed size.')
            }

            if (error.fieldId === 'legalTermsAndConditions' && error.error === 'Required') {
              setTermsAndConditionsError('Terms and conditions must be accepted.')
            }
          })
        } else {
          if (errorResponse.commandError === 'UserAlreadyExist') {
            setServerError('We already have a registered user with the same email address.')
          } else {
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

  function cleanErrors (): void {
    setNameError('')
    setSurnameError('')
    setEmailError('')
    setPasswordError('')
    setTermsAndConditionsError('')
    setServerError('')
  }

  return (
    <>
      <Layout>
        <section>
            <Form>
                <TextField
                    title='Name'
                    isRequired={true}
                    value={name}
                    onChangeHandler={value => setName(value)}
                    errorMessage={nameError}
                />
                <TextField
                    title='Surname'
                    isRequired={true}
                    value={surname}
                    onChangeHandler={value => setSurname(value)}
                    errorMessage={surnameError}
                />
                <TextField
                    title='Email'
                    isRequired={true}
                    value={email}
                    onChangeHandler={value => setEmail(value)}
                    errorMessage={emailError}
                />
                <PasswordField
                    title='Password'
                    isRequired={true}
                    value={password}
                    onChangeHandler={value => setPassword(value)}
                    errorMessage={passwordError}
                />
                <fieldset>
                    <div className='termsAndConditionsContainer'>
                        <input
                            type="checkbox"
                            onChange={e => setAreTermsAndConditionsAccepted(e.target.checked)}
                            checked={areTermsAndConditionsAccepted}>
                        </input>
                        <label>
                            I agree to the <a href='/terms-and-conditions' target='_blank' className='link'> Terms and Conditions</a>
                        </label>
                    </div>
                    <ErrorMessage message={termsAndConditionsError}/>
                </fieldset>
                <Button
                    text='Create Account'
                    onClickHandler={e => signup(e)}
                    isDisabled={isSignUpBtnDisabled}
                    buttonInnerImgSrc='/icons/padlock-f.svg'
                />
                <ErrorMessage message={serverError}/>
                <ClientSideLink
                    text='Already have an account?'
                    href='/login'
                    linkText='Login'
                />
            </Form>
        </section>
      </Layout>
    <style jsx>{`
        section {
            background-color: ${colors.background};
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        fieldset {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }

        fieldset > div {
            width: 100%;
        }

        .field-error {
            border: 1px solid ${colors.error}
        }

        .termsAndConditionsContainer {
            display: inline;
        }

        .termsAndConditionsContainer > input {
            margin-right: 10px;
        }

        .link {
            color: ${colors.link};
            font-weight: bold;
            cursor: pointer;
            line-height: 1.3rem;
        }
    `}</style>
    </>
  )
}

export default SignUp

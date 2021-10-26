import { NextPage } from 'next'
import { useState, MouseEvent } from 'react'

import { colors } from '../styles/theme'
import { UserSignUpControllerRequest } from './api/users/signup/controller'

const SignUp: NextPage = () => {

  const [name, setName] = useState('Antonio');
  const [nameError, setNameError] = useState('');
  const [surname, setSurname] = useState('Sanchez');
  const [surnameError, setSurnameError] = useState('');
  const [email, setEmail] = useState('antonio@email.com');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('NoSecure');
  const [passwordError, setPasswordError] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignUpBtnDisabled, setIsSignUpBtnDisabled] = useState(false);

  function signup(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setIsSignUpBtnDisabled(true)
    cleanErrors()
    const request = new UserSignUpControllerRequest(
        email,
        password,
        name,
        surname,
        true
    );
    fetch('/api/users/signup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch();
    setIsSignUpBtnDisabled(false)
  }

  function cleanErrors(): void {
      setNameError('')
      setSurnameError('')
      setEmailError('')
      setPasswordError('')
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
        <h1>InStock</h1>
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
                                className={`password field ${emailError ? 'field-error' : ''}`}>
                              </input>
                            : <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className={`password field ${emailError ? 'field-error' : ''}`}>
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
            <button className="cta" onClick={e => signup(e)} disabled={isSignUpBtnDisabled}>
                {
                    isSignUpBtnDisabled
                        ? <img src='/gifs/eclipse-white.gif'></img>
                        : <span><img src='/icons/padlock-f.svg'></img>Create Account</span>
                }
            </button>
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

        h1 {
            min-width: 500px;
            text-align: center;
            font-size: 42px;
            margin-bottom: 20px;
            color: ${colors.black};
            text-shadow: 3px 3px ${colors.grey};
        }

        form {
            width: 500px;
            max-height: 400px;
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
            margin-bottom: 5px
        }

    `}</style>
    </>
  )
}

export default SignUp

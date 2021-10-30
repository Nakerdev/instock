import { NextPage } from 'next'
import { useState, MouseEvent } from 'react'
import Router from 'next/router'

import { colors } from '../styles/theme'
import { UserLoginControllerRequest, ResponseDto } from './api/users/login/controller'
import Link from 'next/link'

const Login: NextPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
                <label>Email</label>
                <input 
                    type="text" 
                    onChange={e => setEmail(e.target.value)} 
                    value={email} 
                    className='field'>
                </input>
            </fieldset>
            <fieldset>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <label>Password</label>
                    <Link href='/forgot-password'>
                        <a className='link'>Forgot password?</a>
                    </Link>
                </div>
                <div>
                    {
                        isPasswordVisible
                            ? <input 
                                type="text" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className='password field'>
                              </input>
                            : <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                                className='password field'>
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
                </div>
            </fieldset>
            <button className="cta" onClick={e => login(e)} disabled={isLoginBtnDisabled}>
                {
                    isLoginBtnDisabled
                        ? <img src='/gifs/eclipse-white.gif'></img>
                        : <span><img src='/icons/key-f.svg'></img>Login</span>
                }
            </button>
            <p className="error" style={serverError ? {display: 'block'} : {display: 'none'}}>{serverError}</p>
            <p className='createAccountLink'>New to StockOut? <Link href='/signup'><a className='link'>Create an account</a></Link></p>
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

        .createAccountLink {
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

export default Login

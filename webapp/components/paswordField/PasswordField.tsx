import { useState, MouseEvent } from 'react'

import { colors, fonts } from '../../styles/theme'
import ClientSideLink from '../clientSideLink/ClientSideLink'
import ErrorMessage from '../errorMessage/ErrorMessage'

interface PasswordFieldComponentProps {
    title: string;
    isRequired: boolean;
    value: string;
    onChangeHandler: (value: string) => void;
    errorMessage?: string;
    helperText?: string
    helperLink?: string
}

export default function PasswordField (props: PasswordFieldComponentProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function showPassword (e: MouseEvent<HTMLElement>): void {
    e.preventDefault()
    setIsPasswordVisible(true)
  }

  function hidePassword (e: MouseEvent<HTMLElement>): void {
    e.preventDefault()
    setIsPasswordVisible(false)
  }

  return (
        <>
        <fieldset>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label>{props.title} {props.isRequired ? <span>- required</span> : '' }</label>
                {
                    props.helperLink && props.helperText
                      ? <ClientSideLink href={props.helperLink} linkText={props.helperText}/>
                      : ''
                }
            </div>
            <div>
                {
                    isPasswordVisible
                      ? <input
                            type="text"
                            value={props.value}
                            onChange={e => props.onChangeHandler(e.target.value)}
                            className={`password field ${props.errorMessage ? 'field-error' : ''}`}>
                            </input>
                      : <input
                            type="password"
                            value={props.value}
                            onChange={e => props.onChangeHandler(e.target.value)}
                            className={`password field ${props.errorMessage ? 'field-error' : ''}`}>
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
                {
                    props.errorMessage
                      ? <ErrorMessage message={props.errorMessage}/>
                      : ''
                }
            </div>
        </fieldset>
        <style jsx>{`
            fieldset {
                display: flex;
                flex-direction: column;
                margin-bottom: 15px;
            }

            fieldset > div > label {
                color: ${colors.black};
            }

            fieldset > div > label > span {
                color: ${colors.grey};
                font-size: 14px
            }

            .field { 
                font-family: ${fonts.base};
                color: ${colors.black};
                border: 1px solid #C4C2C2;
                font-size: 16px;
                padding: 0.25em 0.5em;
                border-radius: 5px;
                line-height: 1.5rem
            }

            .field:focus {
                outline: none
            }

            .field-error {
                border: 1px solid ${colors.error}
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
        `}</style>
        </>
  )
}

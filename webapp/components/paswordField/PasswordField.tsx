import { useState, MouseEvent  } from 'react'
import Link from 'next/link'

import { colors } from '../../styles/theme'

interface PasswordFieldComponentProps {
    title: string;
    isRequired: boolean;
    value: string;
    onChangeHandler: (value: string) => void;
    errorMessage?: string;
    helperText?: string
    helperLink?: string
}

export default function PasswordField(props: PasswordFieldComponentProps) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        <fieldset>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <label>{props.title} {props.isRequired ? <span>- required</span> : '' }</label>
                {
                    props.helperLink
                        ? <Link href={props.helperLink}><a className='link'>{props.helperText}</a></Link>
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
                <p className="error" style={props.errorMessage ? {display: 'block'} : {display: 'none'}}>{props.errorMessage}</p>
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

            .field { color: ${colors.black};
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

            .error {
                color: ${colors.error};
                margin-top: 5px;
                margin-left: 2px;
                margin-bottom: 5px;
                line-height: 1.2rem;
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

            .link {
                color: ${colors.link};
                font-weight: bold;
                cursor: pointer;
            }
        `}</style>
        </>
    )
}
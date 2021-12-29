import { colors, fonts } from '../../styles/theme'
import ErrorMessage from '../errorMessage/ErrorMessage'

interface TextAreaComponentProps {
    title: string;
    isRequired: boolean;
    value: string;
    onChangeHandler: (value: string) => void;
    errorMessage?: string;
    placeholder?: string;
}

export default function TextArea (props: TextAreaComponentProps) {
  return (
        <>
        <fieldset>
            <label>{props.title} {props.isRequired ? <span>- required</span> : '' }</label>
            <textarea
                onChange={e => props.onChangeHandler(e.target.value)}
                value={props.value}
                className={`field ${props.errorMessage ? 'field-error' : ''}`}
                placeholder={props.placeholder ? props.placeholder : ''}>
            </textarea>
            {
                props.errorMessage
                  ? <ErrorMessage message={props.errorMessage}/>
                  : ''
            }
        </fieldset>
        <style jsx>{`
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

            .field { 
                font-family: ${fonts.base};
                color: ${colors.black};
                border: 1px solid #C4C2C2;
                font-size: 16px;
                padding: 0.25em 0.5em;
                border-radius: 5px;
                line-height: 1.5rem;
            }

            .field:focus {
                outline: none
            }

            .field-error {
                border: 1px solid ${colors.error}
            }
        `}</style>
        </>
  )
}

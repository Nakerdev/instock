import { colors } from '../../styles/theme'

interface TextFieldComponentProps {
    title: string;
    isRequired: boolean;
    value: string;
    onChangeHandler: (value: string) => void;
    errorMessage?: string;
}

export default function TextField(props: TextFieldComponentProps) {

    return (
        <>
        <fieldset>
            <label>{props.title} {props.isRequired ? <span>- required</span> : '' }</label>
            <input 
                type="text" 
                onChange={e => props.onChangeHandler(e.target.value)} 
                value={props.value} 
                className={`field ${props.errorMessage ? 'field-error' : ''}`}>
            </input>
            <p className="error" style={props.errorMessage ? {display: 'block'} : {display: 'none'}}>{props.errorMessage}</p>
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
        `}</style>
        </>
    )
}
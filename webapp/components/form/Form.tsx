import { PropsWithChildren } from 'react'

import { colors } from '../../styles/theme'

interface FormComponentProps {}

export default function Form (props: PropsWithChildren<FormComponentProps>) {
  return (
        <>
        <form>
            {props.children}
        </form>
        <style jsx>{`
            form {
                min-width: 300px;
                position: absolute;
                margin: 20px;
                background-color: ${colors.white};
                flex: 1;
                border: 1px solid ${colors.white};
                border-radius: 10px;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
                padding: 25px;
            }

            @media (min-width: 600px) {
                form {
                    min-width: 500px;
                    max-width: 500px;
                }
            }
        `}</style>
        </>
  )
}

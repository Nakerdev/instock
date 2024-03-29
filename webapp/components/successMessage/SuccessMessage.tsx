import { PropsWithChildren } from 'react'

import { colors } from '../../styles/theme'

interface SuccessMessageProps {}

export default function SuccessMessage (props: PropsWithChildren<SuccessMessageProps>) {
  return (
        <>
        <p className='success-message'>
            {props.children}
        </p>
        <style jsx>{`
            .success-message {
                background-color: ${colors.success};
                border-radius: 5px;
                padding: 15px;
                color: ${colors.black};
                line-height: 1.3rem
            }
        `}</style>
        </>
  )
}

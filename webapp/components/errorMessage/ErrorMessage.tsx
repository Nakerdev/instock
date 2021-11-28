import { colors } from '../../styles/theme'

interface ErrorMessageComponentProps {
    message: string;
}

export default function ErrorMessage (props: ErrorMessageComponentProps) {
  return (
        <>
        <p className="error" style={props.message ? { display: 'block' } : { display: 'none' }}>{props.message}</p>
        <style jsx>{`
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

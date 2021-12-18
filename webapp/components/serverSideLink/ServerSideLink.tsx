import { colors } from '../../styles/theme'

interface ServerSideLinkComponentProps {
    text?: string;
    href: string;
    linkText: string;
}

export default function ServerSideLink (props: ServerSideLinkComponentProps) {
  return (
        <>
        {
            props.text
              ? <p className='linkText'>{props.text}<a className='link' href={props.href}> {props.linkText}</a></p>
              : <a className='link' href={props.href}> {props.linkText}</a>
        }
        <style jsx>{`
            .link {
                color: ${colors.link};
                font-weight: bold;
                cursor: pointer;
            }

            .linkText {
                margin-top: 20px;
                color: ${colors.black};
                font-size: 16px;
                line-height: 1.3rem;
            }
        `}</style>
        </>
  )
}

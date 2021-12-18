import Link from 'next/link'

import { colors } from '../../styles/theme'

interface ClientSideLinkComponentProps {
    href: string;
    linkText: string;
    text?: string;
    imgSrc?: string;
}

export default function ClientSideLink (props: ClientSideLinkComponentProps) {
  return (
        <>
            {
                props.text
                ? (
                    <p className='linkText'>
                        {props.text}
                        <Link href={props.href}>
                            <a className='link'>
                                {props.imgSrc && <img src={props.imgSrc}></img>}
                                {props.linkText}
                            </a>
                        </Link>
                    </p>
                )
                : (
                    <Link href={props.href}>
                        <a className='link'>
                            {props.imgSrc && <img src={props.imgSrc}></img>}
                            {props.linkText}
                        </a>
                    </Link>
                )
            }
            <style jsx>{`
                a {
                    display: flex;
                    align-items: center;
                    padding: 20px 0;
                }

                img {
                    margin-right: 5px;
                }

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

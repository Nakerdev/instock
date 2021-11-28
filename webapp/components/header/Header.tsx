import Link from 'next/link'

import { colors, fonts } from '../../styles/theme'

export default function Header () {
  return (
        <>
        <header>
            <Link href='/'><a>Sotckout</a></Link>
        </header>
        <style jsx>{`
            header > a {
                display: block;
                background-color: ${colors.background};
                font-size: 36px;
                padding-left: 20px;
                padding-top: 20px;
                color: ${colors.black};
                text-shadow: 2px 3px 3px rgba(0,0,0,0.3);
                font-family: ${fonts.base};
                cursor: pointer;
            }
        `}</style>
        </>
  )
}

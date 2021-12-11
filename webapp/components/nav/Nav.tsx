import Router from 'next/router'

import { colors, fonts } from '../../styles/theme'
import Button from '../button/Button'
import useSession from '../../hooks/useSession'

export default function Nav () {
  const { removeSession } = useSession()

  function logout(){
    removeSession()
    Router.push('/')
  }

  return (
        <>
        <nav>
            <p>Sotckout</p>
            <div>
                <Button
                    text='Settings'
                    onClickHandler={() => new Error('not implemented')}
                    bgColor={colors.grey}
                    isDisabled={false}
                    buttonInnerImgSrc='/icons/cogs.svg'
                    width='180px'
                />
                <Button
                    text='Logout'
                    onClickHandler={() => logout()}
                    bgColor={colors.grey}
                    isDisabled={false}
                    buttonInnerImgSrc='/icons/log-out.svg'
                    width='180px'
                />
            </div>
        </nav>
        <style jsx>{`
            nav {
                background-color: ${colors.white};
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(100, 100, 111, 0.2);
            }

            p {
                display: block;
                font-size: 36px;
                padding-left: 20px;
                color: ${colors.black};
                text-shadow: 2px 3px 3px rgba(0,0,0,0.3);
                font-family: ${fonts.base};
            }

            div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 370px;
                margin-right: 20px;
            }
        `}</style>
        </>
  )
}

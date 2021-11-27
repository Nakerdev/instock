import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react';

import useSession from '../hooks/useSession'
import { colors, fonts } from '../styles/theme';
import Button from '../components/button/Button';
import RocketIcon from '../components/icons/Rocket';

const Dashboard: NextPage = () => {

  const { removeSession, isLogged } = useSession()

  useEffect(() => {
    if(!isLogged){
      Router.push('/');
    }
  }, [isLogged])

  return (
    <>
    <main>
      <aside>
        <h1>Stockout</h1>
        <div className='actionButtonsContainer'>
          <Button text='New Project' onClickHandler={() => {}} isDisabled={false} />
          <Button 
            text='Settings' 
            onClickHandler={() => {}} 
            bgColor={colors.grey} 
            isDisabled={false} 
            buttonInnerImgSrc='/icons/cogs.svg'/>
          <Button 
            text='Logout' 
            onClickHandler={() => removeSession()} 
            bgColor={colors.grey} 
            isDisabled={false} 
            buttonInnerImgSrc='/icons/log-out.svg'/> 
        </div> 
      </aside>
      <section>
        <RocketIcon color={colors.black} width={100}/>
        <h2>Create new project and start tracking your products!</h2>
      </section>
    </main>
    <style jsx>{`
        main {
            background-color: ${colors.background};
            height: 100vh;
            display: flex;
            flex-direction: row;
        }

        aside {
            background-color: ${colors.white};
            height: 100vh;
            width: 300px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px
        }

        h1 {
          font-size: 36px;
          padding-top: 20px;
          color: ${colors.black};
          text-shadow: 2px 3px 3px rgba(0,0,0,0.3);
          font-family: ${fonts.base};
          margin-bottom: 20px;
        }

        main > section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        main > section > h2 {
          font-size: 24px;
          font-family: ${fonts.base};
        }

        .actionButtonsContainer {
          width: 100%;
          padding-bottom: 20px
        }

    `}</style>
    </>
  )
}

export default Dashboard

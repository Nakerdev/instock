import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react';

import useSession from '../hooks/useSession'
import { colors, fonts } from '../styles/theme';
import CTA from '../components/cta/CTA';
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
        <CTA text='New Project' onClickHandler={() => {}} isDisabled={false} />
        <button onClick={() => removeSession()}>Logout</button>
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
            justify-content: start;
            align-items: center;
            padding: 0 10px
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

    `}</style>
    </>
  )
}

export default Dashboard

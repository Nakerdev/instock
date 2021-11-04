import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react';

import useSession from '../hooks/useSession'

const Dashboard: NextPage = () => {

  const { removeSession, isLogged } = useSession()

  useEffect(() => {
    if(!isLogged){
      Router.push('/');
    }
  }, [isLogged])

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => removeSession()}>Logout</button>
    </div>
  )
}

export default Dashboard

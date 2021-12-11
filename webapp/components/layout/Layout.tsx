import { PropsWithChildren } from 'react'
import Head from 'next/head'

import { fonts, colors } from '../../styles/theme'
import Header from '../header/Header'
import useSession from '../../hooks/useSession'
import Nav from '../nav/Nav'

interface LayoutProps {
    pageTitle: string
}

export default function Layout (props: PropsWithChildren<LayoutProps>) {
  const { isLogged } = useSession()

  return (
        <>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap" rel="stylesheet"/>
            <title>Stockout | {props.pageTitle}</title>
        </Head>
        {
            isLogged ? <Nav/> : <Header/>
        }
        <main>
            {props.children}
        </main>
        <style jsx global>{`
            html,
            body,
            #__next {
                padding: 0;
                margin: 0;
                height: 100%;
                background-color: ${colors.background}
            }

            a {
                color: inherit;
                text-decoration: none;
            }

            * {
                box-sizing: border-box;
                font-family: ${fonts.base}
            } 
        `}</style>
        </>
  )
}

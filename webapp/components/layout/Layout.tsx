import { PropsWithChildren } from 'react'
import Head from 'next/head'

import { fonts } from '../../styles/theme'
import Header from '../header/Header'

interface LayoutProps {}

export default function Layout (props: PropsWithChildren<LayoutProps>) {
  return (
        <>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap" rel="stylesheet"/>
        </Head>
        <Header/>
        <main>
            {props.children}
        </main>
        <style jsx global>{`
            html,
            body {
                padding: 0;
                margin: 0;
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

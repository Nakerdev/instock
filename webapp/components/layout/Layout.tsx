import { PropsWithChildren } from 'react'
import Head from 'next/head'

interface LayoutComponentProps {}

export default function Layout(props: PropsWithChildren<LayoutComponentProps>) {
    return (
        <>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap" rel="stylesheet"/> 
        </Head>
        <main>
            {props.children}
        </main>
        </>
    )
}
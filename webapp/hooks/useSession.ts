import { useState, useEffect } from "react"

export default function useSession() {

    const SESSION_TOKEN_ID = 'session-token'

    const [session, setSession] = useState(() => getSession())
   
    useEffect(() => {
        if(session){
            localStorage.setItem(SESSION_TOKEN_ID, session)
        }
    }, [session])

    function removeSession(){
        localStorage.removeItem(SESSION_TOKEN_ID)
        setSession(null)
    }

    function getSession(): string | null {
        if(typeof window === 'undefined') return null;
        return localStorage.getItem(SESSION_TOKEN_ID)
    }

    return {
        setSession,
        removeSession,
        isLogged: session !== null
    }
}
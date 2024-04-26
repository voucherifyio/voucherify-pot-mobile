'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'
const socket = io('http://localhost:3000')

export const useWebsocket = () => {
    const [websocket, setWebsocket] = useState()
    useEffect(() => {
        socket.on('points updated', (data) => {
            console.log(data)
        })
    }, [socket])

    return {
        websocket,
    }
}

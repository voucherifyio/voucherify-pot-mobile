'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

export const useWebsocket = () => {
    const [websocket, setWebsocket] = useState()

    useEffect(() => {
        if (socket.connected) {
            console.log('isCOnnected??????')
        }
        socket.on('send-data', (data) => {
            console.log(data, 'WEBSOCKET DATA')
            setWebsocket(data)
        })
    }, [socket])

    return {
        websocket,
    }
}

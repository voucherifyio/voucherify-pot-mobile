import { NextRequest, NextResponse } from 'next/server'
import io from 'socket.io-client'
const socket = io('http://localhost:3000')

export async function POST() {
    console.log('idzie to w ogołe?????')
    try {
        const webhook = await fetch('/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        const data = await webhook.json()
        console.log(data)
        // console.log(data, 'DATA WEBSOCKET')
        console.log('siema')
        // socket.emit('points updated', data)
        return NextResponse.json({ status: 'success' }, { status: 200 })
    } catch (err) {
        console.error('[Websocket error]', err)
        return NextResponse.json({ error: err }, { status: 200 })
    }
}

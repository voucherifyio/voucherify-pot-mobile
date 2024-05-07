import { NextRequest, NextResponse } from 'next/server'
import io from 'socket.io-client'
const socket = io('http://localhost:3000')

export async function POST(req: NextRequest) {
    console.log('Przed Try/catchem')
    try {
        const data = await req.json()

        console.log(data,'REQUEST')
        console.log('siema')
        socket.emit('webhook-received', data)
        return NextResponse.json({ status: 'success' }, { status: 200 })
    } catch (err) {
        console.error('[Websocket error]', err)
        return NextResponse.json({ error: err }, { status: 200 })
    }
}

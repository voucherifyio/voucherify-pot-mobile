import { NextRequest, NextResponse } from 'next/server'
import io from 'socket.io-client'
const socket = io('https://voucherify-pot-mobile-35601287c1ae.herokuapp.com/')

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        socket.emit('webhook-received', data)
        return NextResponse.json({ status: 'success' }, { status: 200 })
    } catch (err) {
        console.error('[Webhook error]', err)
        return NextResponse.json({ error: err }, { status: 200 })
    }
}

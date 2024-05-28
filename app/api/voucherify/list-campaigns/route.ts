import { listCampaigns } from '@/voucherify/list-campaigns'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextResponse } from 'next/server'

export async function GET() {
    const campaigns = await listCampaigns({ voucherify: getVoucherify() })

    if (!campaigns) {
        return NextResponse.json(
            { error: 'No active campaigns' },
            { status: 404 }
        )
    }

    const response = NextResponse.json({ campaigns }, { status: 200 })
    response.headers.set('Cache-Control', 'no-store')
    return response
}

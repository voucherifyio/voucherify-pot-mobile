import { listMemberRewards } from '@/voucherify/list-member-rewards'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const customerId = await req.nextUrl.searchParams.get('customerId')

    if (customerId) {
        const rewards = await listMemberRewards({
            customerId,
            voucherify: getVoucherify(),
        })

        if (!rewards) {
            return new Response('No rewards assigned to customer', {
                status: 400,
            })
        }

        return NextResponse.json({ rewards }, { status: 200 })
    }
}

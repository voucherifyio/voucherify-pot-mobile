import { listMemberRewards } from '@/voucherify/list-member-rewards'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const customerId = req.nextUrl.searchParams.get('customerId')
    const campaignName = req.nextUrl.searchParams.get('campaignName')

    if (customerId && campaignName) {
        const rewards = await listMemberRewards({
            customerId,
            voucherify: getVoucherify(),
            campaignName,
        })

        if (!rewards) {
            return NextResponse.json(
                { error: 'No rewards assigned to customer' },
                {
                    status: 400,
                }
            )
        }

        return NextResponse.json({ rewards }, { status: 200 })
    }

    return NextResponse.json(
        { error: 'customerId or campaignName does not exist.' },
        { status: 400 }
    )
}

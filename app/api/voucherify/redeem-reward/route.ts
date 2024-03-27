import { redeemReward } from '@/voucherify/redeem-reward'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { customerId, rewardId, campaignName } = await req.json()

    const redeemedReward = await redeemReward({
        customerId,
        rewardId,
        voucherify: getVoucherify(),
        campaignName
    })

    if (redeemedReward?.result === 'FAILURE') {
        return new Response('Cannot use reward, please try again later.', {
            status: 400,
        })
    }

    return NextResponse.json({ redeemedReward }, { status: 200 })
}

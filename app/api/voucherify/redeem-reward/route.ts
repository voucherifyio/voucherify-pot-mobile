import { redeemReward } from '@/voucherify/redeem-reward'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { customerId, rewardId, campaignName } = await req.json()

    if (!customerId || !rewardId || !campaignName) {
        return NextResponse.json(
            {
                error: 'Missing one of customerId, rewardId, campaignName property',
            },
            { status: 400 }
        )
    }

    const redeemedReward = await redeemReward({
        customerId,
        rewardId,
        voucherify: getVoucherify(),
        campaignName,
    })

    if (redeemedReward?.result === 'FAILURE' || !redeemedReward) {
        return NextResponse.json(
            {
                error: 'Cannot redeem reward for some reason, please check audit log.',
            },
            {
                status: 400,
            }
        )
    }

    return NextResponse.json({ redeemedReward }, { status: 200 })
}

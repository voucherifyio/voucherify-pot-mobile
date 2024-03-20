import { NextRequest, NextResponse } from 'next/server'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { redeemRewardWithMemberId } from '@/voucherify/redeem-reward-with-member-id'

export async function POST(req: NextRequest) {
    const { campaignId, rewardId, memberId } = await req.json()

    const redeemedReward = await redeemRewardWithMemberId({
        campaignId,
        rewardId,
        memberId,
        voucherify: getVoucherify(),
    })

    if (redeemedReward?.result === 'FAILURE') {
        return new Response('Cannot use reward, please try again later.', {
            status: 400,
        })
    }

    return NextResponse.json({ redeemedReward }, { status: 200 })
}

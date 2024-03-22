import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    campaignId: string
    memberId: string
    rewardId: string
}

export const redeemRewardWithMemberId = async (params: Params) => {
    const { voucherify, campaignId, rewardId, memberId } = params
    try {
        const response = await voucherify.loyalties.redeemReward(
            campaignId,
            memberId,
            {
                reward: { id: rewardId },
            }
        )
        return response
    } catch (err: any) {
        console.error(err)
        throw new Error(err?.message || 'Failed to redeem reward.')
    }
}

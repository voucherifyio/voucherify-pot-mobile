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
        return await voucherify.loyalties.redeemReward(campaignId, memberId, {
            reward: { id: rewardId },
        })
    } catch (err: any) {
        console.error(err)
        throw new Error(err?.message)
    }
}

import { listCampaignMembers } from '@/voucherify/list-campaign-members'
import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    campaignId: string
    memberId: string
    rewardId: string
}

export const redeemRewardWithMemberId = async (params: Params) => {
    const { voucherify, campaignId, rewardId, memberId } = params

    const redeemedReward = await voucherify.loyalties.redeemReward(
        campaignId,
        memberId,
        { reward: { id: rewardId } }
    )

    return redeemedReward
}

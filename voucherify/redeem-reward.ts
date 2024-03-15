import { VoucherifyServerSide } from '@voucherify/sdk'
import { listCampaignMembers } from './list-campaign-members'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
    rewardId: string
}

export const redeemReward = async (params: Params) => {
    const { voucherify, customerId, rewardId } = params

    const members = await listCampaignMembers({ voucherify })
    const campaign = members.vouchers.find(
        (voucher) => voucher.holder_id === customerId
    )

    if (!campaign?.id) {
        return null
    }

    const redeemedReward = await voucherify.loyalties.redeemReward(
        campaign.campaign_id,
        campaign.code,
        { reward: { id: rewardId } }
    )
    console.log(redeemedReward, 'redeeeeeem')
    return redeemedReward
}

import { VoucherifyServerSide } from '@voucherify/sdk'
import { listVouchers } from './list-vouchers'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
    rewardId: string
    campaignName: string
}

export const redeemReward = async (params: Params) => {
    const { voucherify, customerId, rewardId, campaignName } = params
    const { vouchers } = await listVouchers({
        voucherify,
        campaignName,
        customerIdOrSourceId: customerId,
    })
    const data = vouchers.find((voucher) => voucher.holder_id === customerId)

    if (!data?.campaign_id) {
        return null
    }

    try {
        const redeemedReward = await voucherify.loyalties.redeemReward(
            data.campaign_id,
            data.code,
            { reward: { id: rewardId } }
        )

        return redeemedReward
    } catch (error) {
        return null
    }
}

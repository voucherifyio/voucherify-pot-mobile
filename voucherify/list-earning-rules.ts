import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    campaignId: string
}

export const listEarningRules = async (params: Params) => {
    const { voucherify, campaignId } = params

    try {
        if (campaignId) {
            return await voucherify.loyalties.listEarningRules(campaignId)
        }
    } catch (err) {
        console.error(err)
    }
}

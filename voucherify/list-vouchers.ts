import { VoucherifyServerSide, VouchersResponse } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    campaignName: string
    customerIdOrSourceId: string
}

interface Vouchers extends VouchersResponse {
    campaign_id?: string
}

export const listVouchers = async (params: Params) => {
    const { voucherify, campaignName, customerIdOrSourceId } = params

    const data = await voucherify.vouchers.list({
        campaign: campaignName,
        customer: customerIdOrSourceId,
    })

    return { vouchers: data.vouchers as Vouchers[] }
}

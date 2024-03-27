import { CAMPAIGNS } from '@/enum/campaigns'
import { VoucherifyServerSide, VouchersResponse } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    campaignName: string
}

interface Vouchers extends VouchersResponse {
    campaign_id?: string
}

export const listVouchers = async (params: Params) => {
    const { voucherify, campaignName } = params

    const data = await voucherify.vouchers.list({
        campaign: campaignName,
    })

    return { vouchers: data.vouchers as Vouchers[] }
}

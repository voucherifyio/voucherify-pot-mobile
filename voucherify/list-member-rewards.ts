import { VoucherifyServerSide } from '@voucherify/sdk'
import { listVouchers } from './list-vouchers'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
    campaignName: string
}

export const listMemberRewards = async (params: Params) => {
    const { voucherify, customerId, campaignName } = params
    const { vouchers } = await listVouchers({
        voucherify,
        campaignName,
        customerId,
    })
    const customerMemberId = vouchers.find(
        (voucher) => voucher.holder_id === customerId
    )?.code

    if (!customerMemberId) {
        return null
    }

    const { data } = await voucherify.loyalties.listMemberRewards(
        customerMemberId,
        {
            affordable_only: true,
        }
    )
    return data
}

import { VoucherifyServerSide } from '@voucherify/sdk'
import { listCampaignMembers } from './list-campaign-members'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
}

export const listMemberRewards = async (params: Params) => {
    const { voucherify, customerId } = params
    const members = await listCampaignMembers({ voucherify })
    const customerMemberId = members.vouchers.find(
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

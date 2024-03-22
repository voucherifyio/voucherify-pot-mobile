import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const listCampaignMembers = async (params: Params) => {
    const { voucherify } = params
    const loyaltyCampaign = 'camp_FS6X6mbMJH7WRS41HAXrsxc7'

    const members = await voucherify.loyalties.listMembers(loyaltyCampaign, {
        limit: 50,
    })

    return members
}

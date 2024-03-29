import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
}

export const listCustomerActivities = async (params: Params) => {
    const { customerId, voucherify } = params

    const activities = await voucherify.customers.listActivities(customerId, {
        campaign_type: 'LOYALTY_PROGRAM',
    })

    return activities.data
}

import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
}

export const listCustomerSegments = async (params: Params) => {
    const { voucherify, customerId } = params

    try {
        const fetchedSegments = await voucherify.segments.list(customerId)

        return fetchedSegments
    } catch (err) {
        return null
    }
}

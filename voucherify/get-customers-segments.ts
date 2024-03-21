import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
}

export const getCustomersSegments = async (params: Params) => {
    const { voucherify, customerId } = params

    try {
        const fetchedSegments = await voucherify.segments.list(customerId)

        return fetchedSegments
    } catch (err) {
        return null
    }
}

import { Customer, CustomerObject, VoucherifyServerSide } from '@voucherify/sdk'

type CustomerParams = {
    phone: string
    password?: string
    firstName?: string
    lastName?: string
}

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customer: CustomerParams
}

export const getCustomer = async (params: Params) => {
    const { voucherify, customer } = params

    try {
        const fetchedCustomer = (await voucherify.customers.get(
            customer.phone
        )) as CustomerObject

        if (!fetchedCustomer?.id) {
            return null
        }

        return fetchedCustomer
    } catch (err) {
        return null
    }
}

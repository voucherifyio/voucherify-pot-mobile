import {
    CustomerObject,
    CustomerRequest,
    VoucherifyServerSide,
} from '@voucherify/sdk'
import { CustomersUpdateParams } from '@voucherify/sdk/dist/types/Customers'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerBody: CustomersUpdateParams
}

export const updateCustomer = async (params: Params) => {
    const { voucherify, customerBody } = params

    if (customerBody) {
        try {
            const updatedCustomer = (await voucherify.customers.update(
                customerBody
            )) as CustomerObject

            if (!updatedCustomer?.id) {
                return null
            }

            return updatedCustomer
        } catch (err: any) {
            console.error(`Could not update customer's metadata`)
            throw new Error(err?.message)
        }
    }
}

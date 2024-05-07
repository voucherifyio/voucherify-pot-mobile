import { useState } from 'react'
import { CustomerObject } from '@voucherify/sdk'
import { getCustomer } from '../apiEndpoints/apiEndpoints'
import { METADATA } from '@/enum/metadata'

export const useCustomer = () => {
    const [currentCustomer, setCurrentCustomer] = useState<
        CustomerObject | undefined
    >(undefined)
    const [isLinkedToVoucherify, setIsLinkedToVoucherify] =
        useState<boolean>(false)

    const getCurrentCustomer = async (
        customerSourceId: string | null | undefined
    ) => {
        if (customerSourceId) {
            const res = await getCustomer(customerSourceId)
            const { customer }: { customer: CustomerObject } = await res.json()
            if (res.status !== 200) {
                return undefined
            }

            if (customer.metadata[METADATA.VOUCHERIFY_MEMBER]) {
                setIsLinkedToVoucherify(
                    customer.metadata[METADATA.VOUCHERIFY_MEMBER]
                )
            }
            setCurrentCustomer(customer)
        }
    }

    return {
        customer: currentCustomer,
        getCurrentCustomer,
        isLinkedToVoucherify,
        setCurrentCustomer,
    }
}

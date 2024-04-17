import { useState } from 'react'
import { CustomerObject } from '@voucherify/sdk'
import { getCustomer } from '../apiEndpoints/apiEndpoints'
import {
    ifLoyaltyPointsAmountHasChanged,
    ifRewardPointsAmountHasChanged,
    isNoVoucherifyMember,
} from '../utils/customer'
import { METADATA } from '@/enum/metadata'

export const useCustomer = ({
    customerPhone,
}: {
    customerPhone: string | null | undefined
}) => {
    const [currentCustomer, setCurrentCustomer] = useState<
        CustomerObject | undefined
    >(undefined)
    const [isCustomerUpdated, setIsCustomerUpdated] = useState(false)
    const [isLinkedToVoucherify, setIsLinkedToVoucherify] =
        useState<boolean>(false)

    const getCurrentCustomer = async () => {
        if (customerPhone) {
            const res = await getCustomer(customerPhone)
            const { customer }: { customer: CustomerObject } = await res.json()
            if (res.status !== 200) {
                return undefined
            }

            if (
                !currentCustomer ||
                currentCustomer.id !== customer.id ||
                isNoVoucherifyMember(currentCustomer, customer) ||
                ifLoyaltyPointsAmountHasChanged(currentCustomer, customer) ||
                ifRewardPointsAmountHasChanged(currentCustomer, customer)
            ) {
                setIsCustomerUpdated(true)
                setIsLinkedToVoucherify(customer.metadata[METADATA.VOUCHERIFY_MEMBER])
                setCurrentCustomer(customer)
            }
        }
    }

    return {
        customer: currentCustomer,
        getCurrentCustomer,
        isLinkedToVoucherify,
        isCustomerUpdated,
        setIsCustomerUpdated,
        setCurrentCustomer,
    }
}

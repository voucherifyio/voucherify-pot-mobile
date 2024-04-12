import { useState } from 'react'
import { CustomerObject } from '@voucherify/sdk'
import { getCustomer } from '../apiEndpoints/apiEndpoints'
import {
    ifLoyaltyPointsAmountHasChanged,
    ifRewardPointsAmountHasChanged,
    isNoAeroplanMember,
} from '../utils/customer'

export const useCustomer = ({
    customerPhone,
}: {
    customerPhone: string | null | undefined
}) => {
    const [currentCustomer, setCurrentCustomer] = useState<
        CustomerObject | undefined
    >(undefined)
    const [isCustomerUpdated, setIsCustomerUpdated] = useState(false)
    const [isLinkedToAeroplan, setIsLinkedToAeroplan] = useState<boolean>(false)

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
                isNoAeroplanMember(currentCustomer, customer) ||
                ifLoyaltyPointsAmountHasChanged(currentCustomer, customer) ||
                ifRewardPointsAmountHasChanged(currentCustomer, customer)
            ) {
                setIsCustomerUpdated(true)
                setIsLinkedToAeroplan(customer.metadata?.aeroplan_member)
                setCurrentCustomer(customer)
            }
        }
    }

    return {
        customer: currentCustomer,
        getCurrentCustomer,
        isLinkedToAeroplan,
        isCustomerUpdated,
        setIsCustomerUpdated,
        setCurrentCustomer,
    }
}

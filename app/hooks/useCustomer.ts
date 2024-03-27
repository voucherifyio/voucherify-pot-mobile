import { useState } from 'react'
import { CustomerObject } from '@voucherify/sdk'
import { getCustomer } from '../apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'

export const useCustomer = ({
    customerPhone,
}: {
    customerPhone: string | null | undefined
}) => {
    const [currentCustomer, setCurrentCustomer] = useState<CustomerObject>()
    const [isLinkedToAeroplan, setIsLinkedToAeroplan] = useState<boolean>(false)

    const isNoAeroplanMember = (
        prevCustomer: CustomerObject,
        customer: CustomerObject
    ) =>
        prevCustomer.metadata?.aeroplan_member !==
        customer.metadata?.aeroplan_member

    const ifJourniePointsAmountHasChanged = (
        prevCustomer: CustomerObject,
        customer: CustomerObject
    ) =>
        prevCustomer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points !==
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points

    const ifPromoPointsAmountHasChanged = (
        prevCustomer: CustomerObject,
        customer: CustomerObject
    ) =>
        prevCustomer?.loyalty.campaigns?.[
            CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM
        ]?.points !==
        customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
            ?.points

    const getCurrentCustomer = async () => {
        if (customerPhone) {
            const res = await getCustomer(customerPhone)
            const { customer }: { customer: CustomerObject } = await res.json()
            if (res.status !== 200) {
                return true
            }
            return setCurrentCustomer((prevCustomer) => {
                if (
                    !prevCustomer?.id ||
                    prevCustomer.id !== customer.id ||
                    isNoAeroplanMember(prevCustomer, customer) ||
                    ifJourniePointsAmountHasChanged(prevCustomer, customer) ||
                    ifPromoPointsAmountHasChanged(prevCustomer, customer)
                ) {
                    setIsLinkedToAeroplan(customer.metadata?.aeroplan_member)
                    return customer
                }
                return prevCustomer
            })
        }
    }

    return { customer: currentCustomer, getCurrentCustomer, isLinkedToAeroplan }
}

'use client'
import { useAutoRedeem } from '@/app/hooks/useAutoRedeem'
import { useCustomer } from '@/app/hooks/useCustomer'
import { useInitalizeBraze } from '@/app/hooks/useInitializeBraze'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { CAMPAIGNS } from '@/enum/campaigns'
import { CustomerObject } from '@voucherify/sdk'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, createContext, useEffect } from 'react'

export type DealsAndRewards = {
    rewards: number
    deals: number
}

type MobileAppContextType = {
    dealsAndRewards: DealsAndRewards
    setDealsAndRewards: Dispatch<SetStateAction<DealsAndRewards>>
    customer: CustomerObject | undefined
    getCurrentCustomer: () => Promise<true | void>
    isLinkedToAeroplan: boolean
    autoRedeemError: string | undefined
    autoRedeemSuccessMessage: string | undefined
    unredeemedPoints: number | null
    isCustomerUpdated: boolean
    journiePoints: number | undefined
    promoPoints: number | undefined
    setCurrentCustomer: Dispatch<SetStateAction<CustomerObject | undefined>>
    braze:
        | typeof import('../../../node_modules/@braze/web-sdk/index')
        | undefined
    changeBrazeUser: ({
        customerId,
    }: {
        customerId: string | null | undefined
    }) => Promise<string | null | undefined>
}

export const MobileAppContext = createContext<MobileAppContextType>({
    dealsAndRewards: { deals: 0, rewards: 0 },
    setDealsAndRewards: () => {},
    customer: undefined,
    getCurrentCustomer: async () => true,
    isLinkedToAeroplan: false,
    autoRedeemError: undefined,
    autoRedeemSuccessMessage: undefined,
    unredeemedPoints: null,
    isCustomerUpdated: false,
    journiePoints: undefined,
    promoPoints: undefined,
    setCurrentCustomer: () => undefined,
    braze: undefined,
    changeBrazeUser: async () => null,
})

const MobileApp = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const {
        customer,
        getCurrentCustomer,
        isLinkedToAeroplan,
        isCustomerUpdated,
        setIsCustomerUpdated,
        setCurrentCustomer,
    } = useCustomer({
        customerPhone,
    })
    const customerId = customer?.id
    const { dealsAndRewards, setDealsAndRewards } = useLocalStorage({
        customerId,
    })
    const {
        autoRedeemCalculation,
        autoRedeemError,
        autoRedeemSuccessMessage,
        unredeemedPoints,
        setUnredemeedPoints,
    } = useAutoRedeem()
    const { braze, changeBrazeUser } = useInitalizeBraze()

    const journiePoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points
    const promoPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
            ?.points

    useEffect(() => {
        getCurrentCustomer()
        const interval: NodeJS.Timeout = setInterval(async () => {
            if (!document.hidden) {
                await getCurrentCustomer()
                if (isCustomerUpdated) {
                    setUnredemeedPoints(null)
                    await autoRedeemCalculation(customer)
                    setIsCustomerUpdated(false)
                }
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [customerPhone, isCustomerUpdated])

    return (
        <MobileAppContext.Provider
            value={{
                dealsAndRewards,
                setDealsAndRewards,
                customer,
                getCurrentCustomer,
                isLinkedToAeroplan,
                autoRedeemError,
                autoRedeemSuccessMessage,
                unredeemedPoints,
                isCustomerUpdated,
                journiePoints,
                promoPoints,
                setCurrentCustomer,
                braze,
                changeBrazeUser,
            }}
        >
            {children}
        </MobileAppContext.Provider>
    )
}

export default MobileApp

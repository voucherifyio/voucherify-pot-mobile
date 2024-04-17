'use client'
import { useAutoRedeem } from '@/app/hooks/useAutoRedeem'
import { useCustomer } from '@/app/hooks/useCustomer'
//COMMENTED UNTIL BRAZE WILL BE ENABLED
// import { useInitalizeBraze } from '@/app/hooks/useInitializeBraze'
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
    isLinkedToVoucherify: boolean
    autoRedeemError: string | undefined
    autoRedeemSuccessMessage: string | undefined
    unredeemedPoints: number | null
    isCustomerUpdated: boolean
    loyaltyPoints: number | undefined
    rewardPoints: number | undefined
    setCurrentCustomer: Dispatch<SetStateAction<CustomerObject | undefined>>
    //COMMENTED UNTIL BRAZE WILL BE ENABLED
    // braze:
    //     | typeof import('../../../node_modules/@braze/web-sdk/index')
    //     | undefined
    // changeBrazeUser: ({
    //     customerId,
    // }: {
    //     customerId: string | null | undefined
    // }) => Promise<string | null | undefined>
}

export const MobileAppContext = createContext<MobileAppContextType>({
    dealsAndRewards: { deals: 0, rewards: 0 },
    setDealsAndRewards: () => {},
    customer: undefined,
    getCurrentCustomer: async () => true,
    isLinkedToVoucherify: false,
    autoRedeemError: undefined,
    autoRedeemSuccessMessage: undefined,
    unredeemedPoints: null,
    isCustomerUpdated: false,
    loyaltyPoints: undefined,
    rewardPoints: undefined,
    setCurrentCustomer: () => undefined,
    //COMMENTED UNTIL BRAZE WILL BE ENABLED
    // braze: undefined,
    // changeBrazeUser: async () => null,
})

const MobileApp = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const {
        customer,
        getCurrentCustomer,
        isLinkedToVoucherify,
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
        filterAutoRedeemCampaign,
    } = useAutoRedeem()
    //COMMENTED UNTIL BRAZE WILL BE ENABLED
    // const { braze, changeBrazeUser } = useInitalizeBraze()

    const loyaltyPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.LOYALTY_PROGRAM]?.points
    const rewardPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.MILESTONE_REWARDS_PROGRAM]
            ?.points

    useEffect(() => {
        getCurrentCustomer()
        const autoRedeemCampaign = filterAutoRedeemCampaign()
        const interval: NodeJS.Timeout = setInterval(async () => {
            if (!document.hidden) {
                await getCurrentCustomer()
                if (isCustomerUpdated) {
                    setUnredemeedPoints(null)
                    await autoRedeemCalculation(customer, await autoRedeemCampaign)
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
                isLinkedToVoucherify,
                autoRedeemError,
                autoRedeemSuccessMessage,
                unredeemedPoints,
                isCustomerUpdated,
                loyaltyPoints,
                rewardPoints,
                setCurrentCustomer,
                //COMMENTED UNTIL BRAZE WILL BE ENABLED
                // braze,
                // changeBrazeUser,
            }}
        >
            {children}
        </MobileAppContext.Provider>
    )
}

export default MobileApp

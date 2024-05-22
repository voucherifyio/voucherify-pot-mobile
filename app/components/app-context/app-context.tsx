'use client'
import { useAutoRedeem } from '@/app/hooks/useAutoRedeem'
import { useCustomer } from '@/app/hooks/useCustomer'
import { useBraze } from '@/app/hooks/useBraze'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { CustomerObject } from '@voucherify/sdk'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, createContext, useEffect } from 'react'
import { useLoyalty } from '@/app/hooks/useLoyalty'
import Error from '../error/error'
import { useRedeemReward } from '@/app/hooks/useRedeemReward'

export type DealsAndRewards = {
    rewards: number
    deals: number
}

type MobileAppContextType = {
    dealsAndRewards: DealsAndRewards
    setDealsAndRewards: Dispatch<SetStateAction<DealsAndRewards>>
    customer: CustomerObject | undefined
    isLinkedToVoucherify: boolean
    autoRedeemError: string | undefined
    autoRedeemSuccessMessage: string | undefined
    loyaltyPoints: number
    rewardPoints: number
    setCurrentCustomer: Dispatch<SetStateAction<CustomerObject | undefined>>
    autoRedeem: (
        customer: CustomerObject,
        currentLoyaltyPoints: number
    ) => unknown | undefined
    redeemCustomerReward: (
        customer: CustomerObject | undefined,
        rewardId: string,
        campaignName: string
    ) => Promise<{ status: 'success' | 'error' }>
    rewardErrorMessage: string | undefined
    rewardSuccessMessage: string | undefined
    loyaltyCampaignName: string | undefined
    isLoyaltyPointsCalculated: boolean
    setIsLoyaltyPointsCalculated: Dispatch<SetStateAction<boolean>>
    braze:
        | typeof import('../../../node_modules/@braze/web-sdk/index')
        | undefined
    updateBrazeUser: ({
        customerId,
    }: {
        customerId: string | null | undefined
    }) => Promise<string | null | undefined>
}

export const MobileAppContext = createContext<MobileAppContextType>({
    dealsAndRewards: { deals: 0, rewards: 0 },
    setDealsAndRewards: () => {},
    customer: undefined,
    isLinkedToVoucherify: false,
    autoRedeemError: undefined,
    autoRedeemSuccessMessage: undefined,
    loyaltyPoints: 0,
    rewardPoints: 0,
    setCurrentCustomer: () => undefined,
    autoRedeem: () => undefined,
    redeemCustomerReward: () => Promise.resolve({ status: 'success' }),
    rewardErrorMessage: undefined,
    rewardSuccessMessage: undefined,
    loyaltyCampaignName: undefined,
    isLoyaltyPointsCalculated: false,
    setIsLoyaltyPointsCalculated: () => false,
    braze: undefined,
    updateBrazeUser: async () => null,
})

const MobileApp = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const { customer, loadCustomer, isLinkedToVoucherify, setCurrentCustomer } =
        useCustomer()
    const customerId = customer?.id
    const { dealsAndRewards, setDealsAndRewards } = useLocalStorage({
        customerId,
    })
    const {
        autoRedeem,
        autoRedeemError,
        autoRedeemSuccessMessage,
        isLoyaltyPointsCalculated,
        setIsLoyaltyPointsCalculated,
    } = useAutoRedeem()
    const { braze, updateBrazeUser } = useBraze()
    const {
        loyaltyPoints,
        rewardPoints,
        loadInitialPoints,
        loyaltyError,
        loyaltyCampaignName,
    } = useLoyalty({ customerId })
    const { redeemCustomerReward, rewardErrorMessage, rewardSuccessMessage } =
        useRedeemReward()

    useEffect(() => {
        loadCustomer(customerPhone)
        loadInitialPoints(customerPhone)
        if (!document.hidden && !customer?.id) {
            const interval: NodeJS.Timeout = setInterval(
                async () => await loadCustomer(customerPhone),
                3000
            )
            return () => clearInterval(interval)
        }
    }, [customerPhone, customer?.id])

    if (loyaltyError) return <Error message={loyaltyError} />

    return (
        <MobileAppContext.Provider
            value={{
                dealsAndRewards,
                setDealsAndRewards,
                customer,
                isLinkedToVoucherify,
                autoRedeemError,
                autoRedeemSuccessMessage,
                autoRedeem,
                loyaltyPoints,
                rewardPoints,
                setCurrentCustomer,
                redeemCustomerReward,
                rewardErrorMessage,
                rewardSuccessMessage,
                loyaltyCampaignName,
                isLoyaltyPointsCalculated,
                setIsLoyaltyPointsCalculated,
                braze,
                updateBrazeUser,
            }}
        >
            {children}
        </MobileAppContext.Provider>
    )
}

export default MobileApp

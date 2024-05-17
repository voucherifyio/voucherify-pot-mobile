'use client'
import { useAutoRedeem } from '@/app/hooks/useAutoRedeem'
import { useCustomer } from '@/app/hooks/useCustomer'
import { useInitalizeBraze } from '@/app/hooks/useInitializeBraze'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { CAMPAIGNS } from '@/enum/campaigns'
import { CustomerObject } from '@voucherify/sdk'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, createContext, useEffect } from 'react'
import { useLoyaltyData } from '@/app/hooks/useLoyaltyData'
import Error from '../error/error'
import { useUpdateLoyaltyPoints } from '@/app/hooks/useUpdateLoyaltyPoints'
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
    autoRedeemCalculation: (
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
    loyaltyPointsCalculation: boolean
    setLoyaltyPointsCalulcation: Dispatch<SetStateAction<boolean>>
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
    isLinkedToVoucherify: false,
    autoRedeemError: undefined,
    autoRedeemSuccessMessage: undefined,
    loyaltyPoints: 0,
    rewardPoints: 0,
    setCurrentCustomer: () => undefined,
    autoRedeemCalculation: () => undefined,
    redeemCustomerReward: () => Promise.resolve({ status: 'success' }),
    rewardErrorMessage: undefined,
    rewardSuccessMessage: undefined,
    loyaltyCampaignName: undefined,
    loyaltyPointsCalculation: false,
    setLoyaltyPointsCalulcation: () => false,
    braze: undefined,
    changeBrazeUser: async () => null,
})

const MobileApp = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const {
        customer,
        getCurrentCustomer,
        isLinkedToVoucherify,
        setCurrentCustomer,
    } = useCustomer()
    const customerId = customer?.id
    const { dealsAndRewards, setDealsAndRewards } = useLocalStorage({
        customerId,
    })
    const {
        autoRedeemCalculation,
        autoRedeemError,
        autoRedeemSuccessMessage,
        loyaltyPointsCalculation,
        setLoyaltyPointsCalulcation,
    } = useAutoRedeem()
    const { braze, changeBrazeUser } = useInitalizeBraze()
    const { validateLoyaltyCampaigns, loyaltyDataError, loyaltyCampaignName } =
        useLoyaltyData()
    const { loyaltyPoints, rewardPoints, setLoyaltyPoints, setRewardPoints } =
        useUpdateLoyaltyPoints({ customerId })
    const { redeemCustomerReward, rewardErrorMessage, rewardSuccessMessage } =
        useRedeemReward()

    const getInitialPointsLoyaltyCampaigns = async (
        customerSourceId: string | null | undefined
    ) => {
        const loyaltyCampaigns =
            await validateLoyaltyCampaigns(customerSourceId)
        setLoyaltyPoints(
            loyaltyCampaigns.find((campaign) =>
                [
                    CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID,
                    CAMPAIGNS.LOYALTY_PROGRAM_ID,
                ].includes(campaign.id as CAMPAIGNS)
            )?.loyaltyPoints || 0
        )

        setRewardPoints(
            loyaltyCampaigns.find(
                (campaign) =>
                    campaign?.id === CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID
            )?.loyaltyPoints || 0
        )
    }

    useEffect(() => {
        getCurrentCustomer(customerPhone)
        getInitialPointsLoyaltyCampaigns(customerPhone)
        if (!document.hidden && !customer?.id) {
            const interval: NodeJS.Timeout = setInterval(
                async () => await getCurrentCustomer(customerPhone),
                3000
            )
            return () => clearInterval(interval)
        }
    }, [customerPhone, customer?.id])

    if (loyaltyDataError) return <Error message={loyaltyDataError} />

    return (
        <MobileAppContext.Provider
            value={{
                dealsAndRewards,
                setDealsAndRewards,
                customer,
                isLinkedToVoucherify,
                autoRedeemError,
                autoRedeemSuccessMessage,
                autoRedeemCalculation,
                loyaltyPoints,
                rewardPoints,
                setCurrentCustomer,
                redeemCustomerReward,
                rewardErrorMessage,
                rewardSuccessMessage,
                loyaltyCampaignName,
                loyaltyPointsCalculation,
                setLoyaltyPointsCalulcation,
                braze,
                changeBrazeUser,
            }}
        >
            {children}
        </MobileAppContext.Provider>
    )
}

export default MobileApp

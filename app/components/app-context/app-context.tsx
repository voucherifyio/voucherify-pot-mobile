'use client'
import { useAutoRedeem } from '@/app/hooks/useAutoRedeem'
import { useCustomer } from '@/app/hooks/useCustomer'
//COMMENTED UNTIL BRAZE WILL BE ENABLED
// import { useInitalizeBraze } from '@/app/hooks/useInitializeBraze'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { CAMPAIGNS } from '@/enum/campaigns'
import { CustomerObject } from '@voucherify/sdk'
import { useSession } from 'next-auth/react'
import {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from 'react'
import { useLoyaltyData } from '@/app/hooks/useLoyaltyData'
import Error from '../error/error'
import { useWebsocket } from '@/app/hooks/useWebsocket'

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
    unredeemedPoints: number | null
    isCustomerUpdated: boolean
    loyaltyPoints: number | undefined
    rewardPoints: number | undefined
    setCurrentCustomer: Dispatch<SetStateAction<CustomerObject | undefined>>
    autoRedeemCalculation: (customer: CustomerObject) => unknown | undefined
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
    isLinkedToVoucherify: false,
    autoRedeemError: undefined,
    autoRedeemSuccessMessage: undefined,
    unredeemedPoints: null,
    isCustomerUpdated: false,
    loyaltyPoints: undefined,
    rewardPoints: undefined,
    setCurrentCustomer: () => undefined,
    autoRedeemCalculation: () => undefined,
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
        unredeemedPoints,
        setUnredemeedPoints,
    } = useAutoRedeem()
    //COMMENTED UNTIL BRAZE WILL BE ENABLED
    // const { braze, changeBrazeUser } = useInitalizeBraze()

    const { validateLoyaltyCampaigns, error } = useLoyaltyData()
    const [loyaltyPoints, setLoyaltyPoints] = useState<number | undefined>(0)
    const [rewardPoints, setRewardPoints] = useState<number | undefined>(0)
    const { websocket } = useWebsocket()
    console.log(websocket, "Webscoket")
    const getPointsLoyaltyCampaigns = async (
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
            )?.loyaltyPoints
        )

        setRewardPoints(
            loyaltyCampaigns.find(
                (campaign) =>
                    campaign?.id === CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID
            )?.loyaltyPoints
        )
    }

    useEffect(() => {
        getCurrentCustomer(customerPhone)
        getPointsLoyaltyCampaigns(customerPhone)
        if (!document.hidden && !customer?.id) {
            const interval: NodeJS.Timeout = setInterval(
                async () => await getCurrentCustomer(customerPhone),
                3000
            )
            return () => clearInterval(interval)
        }
    }, [customerPhone, customer?.id])

    if (error) {
        return <Error message={error} />
    }

    return (
        <MobileAppContext.Provider
            value={{
                dealsAndRewards,
                setDealsAndRewards,
                customer,
                isLinkedToVoucherify,
                autoRedeemError,
                autoRedeemSuccessMessage,
                unredeemedPoints,
                autoRedeemCalculation,
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

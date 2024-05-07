import {
    CampaignResponse,
    CustomerObject,
    RewardsCreateResponse,
    RewardsGetResponse,
} from '@voucherify/sdk'
import { useState } from 'react'
import {
    listCampaigns,
    listCustomerActivities,
    listRewards,
    redeemReward,
} from '../apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import {
    checkIfRewardPointsAfterLoyaltyPoints,
    customerPointsCalculation,
} from '../utils/customer'
import { EVENT_TYPES } from '@/enum/customer-event-types'
import { METADATA } from '@/enum/metadata'

type RewardParameters = {
    campaign?: {
        id: string
        balance?: number
        type?:
            | 'DISCOUNT_COUPONS'
            | 'PROMOTION'
            | 'GIFT_VOUCHERS'
            | 'REFERRAL_PROGRAM'
    }
}

export const useAutoRedeem = () => {
    const [autoRedeemError, setAutoRedeemError] = useState<string | undefined>()
    const [autoRedeemSuccessMessage, setAutoRedeemSuccessMessage] = useState<
        string | undefined
    >()
    const [unredeemedPoints, setUnredemeedPoints] = useState<number | null>(
        null
    )

    const autoRedeemCalculation = async (
        customer: CustomerObject | undefined
    ) => {
        const currentLoyaltyPoints =
            customer?.loyalty.campaigns?.[CAMPAIGNS.LOYALTY_PROGRAM]?.points
        const currentRewardPoints =
            customer?.loyalty.campaigns?.[CAMPAIGNS.MILESTONE_REWARDS_PROGRAM]
                ?.points
        const autoRedeemCampaignReward = await filterAutoRedeemCampaignReward()

        if (
            customer?.id &&
            currentLoyaltyPoints &&
            currentLoyaltyPoints >= 300 &&
            currentRewardPoints === 0 &&
            autoRedeemCampaignReward?.id &&
            customer.metadata[METADATA.VOUCHERIFY_MEMBER]
        ) {
            const res = await listCustomerActivities(customer.id)
            const { activities } = await res.json()
            const lastActivityEvent = activities[0]
            const {
                lastRewardedLoyaltyPoints,
                lastRewardedRewardPoints,
                penultimateRewardedRewardPoints,
            } = customerPointsCalculation(activities)

            if (!lastActivityEvent.data.balance && currentLoyaltyPoints < 300) {
                return false
            }
            if (
                [
                    EVENT_TYPES.CUSTOMER_REWARDED,
                    EVENT_TYPES.CUSTOMER_REDEMPTIONS_SUCCEEDED,
                    EVENT_TYPES.CUSTOMER_REWARD_REDEMPTIONS_CREATED,
                    EVENT_TYPES.CUSTOMER_REWARD_REDEMPTION_COMPLETED,
                ].includes(lastActivityEvent.type) &&
                currentLoyaltyPoints >= 300
            ) {
                return await autoRdeemBasedOnVoucherifyPlan(
                    customer.id,
                    currentLoyaltyPoints,
                    autoRedeemCampaignReward
                )
            }
            if (
                lastRewardedLoyaltyPoints?.data.balance.balance >= 300 &&
                lastRewardedRewardPoints?.data.balance.balance === 0
            ) {
                const isRewardPointsAfterLoyaltyPoints =
                    checkIfRewardPointsAfterLoyaltyPoints(
                        lastRewardedLoyaltyPoints,
                        penultimateRewardedRewardPoints
                    )

                if (isRewardPointsAfterLoyaltyPoints) {
                    return await autoRdeemBasedOnVoucherifyPlan(
                        customer.id,
                        currentLoyaltyPoints,
                        autoRedeemCampaignReward
                    )
                }
            }
        }
        return undefined
    }

    const autoRdeemBasedOnVoucherifyPlan = async (
        customerId: string | undefined,
        currentLoyaltyPoints: number,
        autoRedeemReward: RewardsGetResponse
    ) => {
        let redeemQuantity = Math.floor(currentLoyaltyPoints / 300)

        while (redeemQuantity > 0) {
            const res = await redeemReward(
                customerId,
                autoRedeemReward?.id,
                CAMPAIGNS.LOYALTY_PROGRAM
            )
            if (res.status !== 200) {
                return setAutoRedeemError('Redemption failed')
            }

            if (res.ok && redeemQuantity === 1) {
                setUnredemeedPoints(currentLoyaltyPoints % 300)
                setAutoRedeemSuccessMessage(
                    `Successfully redeemed reward - ${autoRedeemReward?.name}`
                )
                return setTimeout(
                    () => setAutoRedeemSuccessMessage(undefined),
                    5000
                )
            }
            if (res.ok) {
                redeemQuantity--
            }
        }
    }

    const filterAutoRedeemCampaignReward = async () => {
        const res = await listCampaigns()
        if (res.status > 299) {
            const { error } = await res.json()
            console.error(error)
        }

        if (res.ok) {
            const { campaigns }: { campaigns: CampaignResponse[] } =
                await res.json()

            const autoRedeemCampaign = campaigns.find(
                (campaign) => campaign.metadata?.Autoredeem
            )
            const rewardsRes = await listRewards()

            if (res.ok) {
                const { rewards }: { rewards: RewardsCreateResponse[] } =
                    await rewardsRes.json()

                const reward = rewards.find((reward) => {
                    const parameters = reward.parameters as RewardParameters
                    if (parameters.campaign?.id === autoRedeemCampaign?.id) {
                        return reward
                    }
                })

                return reward
            }
        }
    }

    return {
        unredeemedPoints,
        autoRedeemCalculation,
        autoRedeemSuccessMessage,
        autoRedeemError,
    }
}

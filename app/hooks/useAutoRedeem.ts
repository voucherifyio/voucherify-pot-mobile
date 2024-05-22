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
    const [isLoyaltyPointsCalculated, setIsLoyaltyPointsCalculated] =
        useState(false)

    const autoRedeem = async (
        customer: CustomerObject | undefined,
        currentLoyaltyPoints: number
    ) => {
        const autoRedeemCampaignReward = await filterAutoRedeemCampaignReward()
        if (
            customer?.id &&
            currentLoyaltyPoints >= 300 &&
            autoRedeemCampaignReward?.id &&
            customer.metadata[METADATA.VOUCHERIFY_MEMBER]
        ) {
            const res = await listCustomerActivities(customer.id)
            const { activities } = await res.json()
            const lastActivityEvent = activities[0]
            const rewardPoints =
                lastActivityEvent.data.voucher.campaign_id ===
                    CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID &&
                lastActivityEvent.data.voucher.loyalty_card.balance === 0

            if (rewardPoints && currentLoyaltyPoints >= 300) {
                return await autoRedeemBasedOnVoucherifyPlan(
                    customer.id,
                    currentLoyaltyPoints,
                    autoRedeemCampaignReward
                )
            }
        }
        return undefined
    }

    const autoRedeemBasedOnVoucherifyPlan = async (
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
                setIsLoyaltyPointsCalculated(true)
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
        autoRedeem,
        autoRedeemSuccessMessage,
        autoRedeemError,
        isLoyaltyPointsCalculated,
        setIsLoyaltyPointsCalculated,
    }
}

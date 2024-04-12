import { CustomerObject } from '@voucherify/sdk'
import { useState } from 'react'
import {
    listCustomerActivities,
    redeemReward,
} from '../apiEndpoints/apiEndpoints'
import dayjs from 'dayjs'
import { REWARDS } from '@/enum/rewards'
import { CAMPAIGNS } from '@/enum/campaigns'
import { customerPointsCalculation } from '../utils/customer'
import { EVENT_TYPES } from '@/enum/customer-event-types'

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

        if (
            customer?.id &&
            currentLoyaltyPoints !== undefined &&
            currentLoyaltyPoints >= 300 &&
            currentRewardPoints === 0
        ) {
            const res = await listCustomerActivities(customer.id)
            const { activities } = await res.json()
            const lastActivityEvent = activities[0]
            const {
                lastRewardedLoyaltyPoints,
                lastRewardedRewardPoints,
                penultimateRewardedRewardPoints,
            } = customerPointsCalculation(activities)

            if (!activities[0].data.balance && currentLoyaltyPoints < 300) {
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
                return await autoRedeemReward(customer, currentLoyaltyPoints)
            }
            if (
                lastRewardedLoyaltyPoints?.data.balance.balance >= 300 &&
                lastRewardedRewardPoints?.data.balance.balance === 0
            ) {
                const lastDateLoyaltyPoints = dayjs(
                    lastRewardedLoyaltyPoints?.created_at
                ).format('YYYY-DD-MM HH:mm:ss')

                const lastDatePenultimatePoints = dayjs(
                    penultimateRewardedRewardPoints?.created_at
                ).format('YYYY-DD-MM HH:mm:ss')

                const isRewardPointsAfterLoyaltyPoints = dayjs(
                    lastDatePenultimatePoints
                ).isAfter(lastDateLoyaltyPoints)

                if (isRewardPointsAfterLoyaltyPoints) {
                    return await autoRedeemReward(
                        customer,
                        currentLoyaltyPoints
                    )
                }
            }
        }
    }

    const redeemDependOnAeroplan = async (
        customerId: string | undefined,
        rewardId: string,
        campaignName: string,
        aeroplan: boolean,
        currentLoyaltyPoints: number
    ) => {
        let redeemQuantity = Math.floor(currentLoyaltyPoints / 300)

        while (redeemQuantity > 0) {
            const res = await redeemReward(customerId, rewardId, campaignName)
            if (res.status !== 200) {
                return setAutoRedeemError('Redemption failed')
            }

            if (res.ok && redeemQuantity === 1) {
                setUnredemeedPoints(currentLoyaltyPoints % 300)
                setAutoRedeemSuccessMessage(
                    `Successfully redeemed reward - ${aeroplan ? REWARDS.AEROPLAN_TRANSFER_REWARD : REWARDS.SEVEN_CENTS_PER_LITER_REWARD}`
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

    const autoRedeemReward = async (
        customer: CustomerObject | undefined,
        currentLoyaltyPoints: number
    ) => {
        const aeroplan = customer?.metadata.aeroplan_member

        if (aeroplan) {
            return await redeemDependOnAeroplan(
                customer?.id,
                REWARDS.AEROPLAN_TRANSFER_REWARD_ID,
                CAMPAIGNS.LOYALTY_PROGRAM,
                aeroplan,
                currentLoyaltyPoints
            )
        }
        if (!aeroplan) {
            return await redeemDependOnAeroplan(
                customer?.id,
                REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID,
                CAMPAIGNS.LOYALTY_PROGRAM,
                aeroplan,
                currentLoyaltyPoints
            )
        }
    }

    return {
        unredeemedPoints,
        autoRedeemCalculation,
        autoRedeemSuccessMessage,
        autoRedeemError,
        setUnredemeedPoints,
    }
}

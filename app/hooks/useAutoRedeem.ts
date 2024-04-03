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
        const currentJourniePoints =
            customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
                ?.points
        const currentPromoPoints =
            customer?.loyalty.campaigns?.[
                CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM
            ]?.points

        if (
            customer?.id &&
            currentJourniePoints !== undefined &&
            currentJourniePoints >= 300 &&
            currentPromoPoints === 0
        ) {
            const res = await listCustomerActivities(customer.id)
            const { activities } = await res.json()
            const lastActivityEvent = activities[0]
            const {
                lastRewardedJourniePoints,
                lastRewardedPromoPoints,
                penultimateRewardedPromoPoints,
            } = customerPointsCalculation(activities)

            if (!activities[0].data.balance && currentJourniePoints < 300) {
                return false
            }
            if (
                [
                    EVENT_TYPES.CUSTOMER_REWARDED,
                    EVENT_TYPES.CUSTOMER_REDEMPTIONS_SUCCEEDED,
                    EVENT_TYPES.CUSTOMER_REWARD_REDEMPTIONS_CREATED,
                    EVENT_TYPES.CUSTOMER_REWARD_REDEMPTION_COMPLETED,
                ].includes(lastActivityEvent.type) &&
                currentJourniePoints >= 300
            ) {
                return await autoRedeemReward(customer, currentJourniePoints)
            }
            if (
                lastRewardedJourniePoints?.data.balance.balance >= 300 &&
                lastRewardedPromoPoints?.data.balance.balance === 0
            ) {
                const lastDateJourniePoints = dayjs(
                    lastRewardedJourniePoints?.created_at
                ).format('YYYY-DD-MM HH:mm:ss')

                const lastDatePenultimatePoints = dayjs(
                    penultimateRewardedPromoPoints?.created_at
                ).format('YYYY-DD-MM HH:mm:ss')

                const isPromoPointsAfterJourniePoints = dayjs(
                    lastDatePenultimatePoints
                ).isAfter(lastDateJourniePoints)

                if (isPromoPointsAfterJourniePoints) {
                    return await autoRedeemReward(
                        customer,
                        currentJourniePoints
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
        currentJourniePoints: number
    ) => {
        let redeemQuantity = Math.floor(currentJourniePoints / 300)

        while (redeemQuantity > 0) {
            const res = await redeemReward(customerId, rewardId, campaignName)
            if (res.status !== 200) {
                return setAutoRedeemError('Redemption failed')
            }

            if (res.ok && redeemQuantity === 1) {
                setUnredemeedPoints(currentJourniePoints % 300)
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
        currentJourniePoints: number
    ) => {
        const aeroplan = customer?.metadata.aeroplan_member

        if (aeroplan) {
            return await redeemDependOnAeroplan(
                customer?.id,
                REWARDS.AEROPLAN_TRANSFER_REWARD_ID,
                CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM,
                aeroplan,
                currentJourniePoints
            )
        }
        if (!aeroplan) {
            return await redeemDependOnAeroplan(
                customer?.id,
                REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID,
                CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM,
                aeroplan,
                currentJourniePoints
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

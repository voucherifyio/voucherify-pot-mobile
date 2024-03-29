import { CustomerObject } from '@voucherify/sdk'
import { useState } from 'react'
import {
    listCustomerActivities,
    redeemReward,
} from '../apiEndpoints/apiEndpoints'
import dayjs from 'dayjs'
import { REWARDS } from '@/enum/rewards'
import { CAMPAIGNS } from '@/enum/campaigns'
import { pointsCalculation } from '../utils/customer'

export const useAutoRedeem = () => {
    const [error, setError] = useState<string | undefined>()
    const [successMessage, setSuccessMessage] = useState<string | undefined>()
    const [restNotRedeemedPoints, setRestNotRedeemedPoints] = useState<
        number | null
    >(null)

    const autoRedeemCalculation = async (
        customer: CustomerObject | undefined
    ) => {
        const currentJourniePoints =
            customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
                ?.points || 0
        const promoPoints =
            customer?.loyalty.campaigns?.[
                CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM
            ]?.points || 0

        if (customer?.id && currentJourniePoints >= 300 && promoPoints === 0) {
            const res = await listCustomerActivities(customer.id)
            const { activities } = await res.json()
            const {
                lastCustomerRewardedJourniePoints,
                lastCustomerRewardedPromoPoints,
                penultimateCustomerRewardedPromoPoints,
            } = pointsCalculation(activities)

            if (!activities[0].data.balance && currentJourniePoints < 300) {
                console.log('1')
                return false
            }
            if (!activities[0].data.balance && currentJourniePoints >= 300) {
                console.log('2')
                return autoRedeemReward(customer, currentJourniePoints)
            }
            if (
                lastCustomerRewardedJourniePoints?.data.balance.balance >=
                    300 &&
                lastCustomerRewardedPromoPoints?.data.balance.balance === 0
            ) {
                const lastDateJourniePoints = dayjs(
                    lastCustomerRewardedJourniePoints?.created_at
                ).format('YYYY-DD-MM HH:mm:ss')
                const lastDatePenultimatePoints = dayjs(
                    penultimateCustomerRewardedPromoPoints?.created_at
                ).format('YYYY-DD-MM HH:mm:ss')

                const isPromoPointsAfterJourniePoints = dayjs(
                    lastDatePenultimatePoints
                ).isAfter(lastDateJourniePoints)

                if (isPromoPointsAfterJourniePoints) {
                    console.log('3')
                    return autoRedeemReward(customer, currentJourniePoints)
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
        let res
        while (redeemQuantity > 0) {
            res = await redeemReward(customerId, rewardId, campaignName)
            redeemQuantity--
        }
        if (res && res?.status !== 200) {
            setError('Redemption failed')
        }
        if (res?.ok && redeemQuantity === 0) {
            setRestNotRedeemedPoints(currentJourniePoints % 300)
            setSuccessMessage(
                `Successfully redeemed reward - ${aeroplan ? REWARDS.AEROPLAN_TRANSFER_REWARD : REWARDS.SEVEN_CENTS_PER_LITER_REWARD}`
            )
        }
    }

    const autoRedeemReward = async (
        customer: CustomerObject | undefined,
        currentJourniePoints: number
    ) => {
        const aeroplan = customer?.metadata.aeroplan_member

        if (aeroplan) {
            redeemDependOnAeroplan(
                customer?.id,
                REWARDS.AEROPLAN_TRANSFER_REWARD_ID,
                CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM,
                aeroplan,
                currentJourniePoints
            )
        }
        if (!aeroplan) {
            redeemDependOnAeroplan(
                customer?.id,
                REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID,
                CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM,
                aeroplan,
                currentJourniePoints
            )
        }
    }

    return {
        restNotRedeemedPoints,
        autoRedeemCalculation,
        successMessage,
        error,
    }
}

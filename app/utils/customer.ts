import { CAMPAIGNS } from '@/enum/campaigns'
import { EVENT_TYPES } from '@/enum/customer-event-types'
import { METADATA } from '@/enum/metadata'
import { CustomerObject } from '@voucherify/sdk'
import dayjs from 'dayjs'

export const isNoVoucherifyMember = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer.metadata[METADATA.VOUCHERIFY_MEMBER] !==
    customer.metadata[METADATA.VOUCHERIFY_MEMBER]

export const ifLoyaltyPointsAmountHasChanged = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer?.loyalty.campaigns?.[CAMPAIGNS.LOYALTY_PROGRAM]?.points !==
    customer?.loyalty.campaigns?.[CAMPAIGNS.LOYALTY_PROGRAM]?.points

export const ifRewardPointsAmountHasChanged = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer?.loyalty.campaigns?.[CAMPAIGNS.MILESTONE_REWARDS_PROGRAM]
        ?.points !==
    customer?.loyalty.campaigns?.[CAMPAIGNS.MILESTONE_REWARDS_PROGRAM]?.points

export const checkIfRewardPointsAfterLoyaltyPoints = (
    lastRewardedLoyaltyPoints: Record<string, any> | undefined,
    penultimateRewardedRewardPoints: Record<string, any> | undefined
) => {
    const lastDateLoyaltyPoints = dayjs(
        lastRewardedLoyaltyPoints?.created_at
    ).format('YYYY-DD-MM HH:mm:ss')

    const lastDatePenultimatePoints = dayjs(
        penultimateRewardedRewardPoints?.created_at
    ).format('YYYY-DD-MM HH:mm:ss')

    const isRewardPointsAfterLoyaltyPoints = dayjs(
        lastDatePenultimatePoints
    ).isAfter(lastDateLoyaltyPoints)

    return { isRewardPointsAfterLoyaltyPoints }
}

export const customerPointsCalculation = (
    activities: Record<string, any>[]
) => {
    const lastRewardedLoyaltyPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign === CAMPAIGNS.LOYALTY_PROGRAM
    )
    const lastRewardedRewardPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign === CAMPAIGNS.MILESTONE_REWARDS_PROGRAM
    )
    const penultimateRewardedRewardPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.MILESTONE_REWARDS_PROGRAM &&
            event.data.balance.points >= 1
    )

    return {
        lastRewardedLoyaltyPoints,
        lastRewardedRewardPoints,
        penultimateRewardedRewardPoints,
    }
}

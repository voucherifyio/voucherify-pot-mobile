import { CAMPAIGNS } from '@/enum/campaigns'
import { EVENT_TYPES } from '@/enum/customer-event-types'
import { CustomerObject } from '@voucherify/sdk'

export const isNoAeroplanMember = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer.metadata?.aeroplan_member !==
    customer.metadata?.aeroplan_member

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

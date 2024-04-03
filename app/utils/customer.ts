import { CAMPAIGNS } from '@/enum/campaigns'
import { EVENT_TYPES } from '@/enum/customer-event-types'
import { CustomerObject } from '@voucherify/sdk'

export const isNoAeroplanMember = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer.metadata?.aeroplan_member !==
    customer.metadata?.aeroplan_member

export const ifJourniePointsAmountHasChanged = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
        ?.points !==
    customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]?.points

export const ifPromoPointsAmountHasChanged = (
    prevCustomer: CustomerObject,
    customer: CustomerObject
) =>
    prevCustomer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
        ?.points !==
    customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
        ?.points

export const customerPointsCalculation = (
    activities: Record<string, any>[]
) => {
    const lastRewardedJourniePoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM
    )
    const lastRewardedPromoPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM
    )
    const penultimateRewardedPromoPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM &&
            event.data.balance.points >= 1
    )

    return {
        lastRewardedJourniePoints,
        lastRewardedPromoPoints,
        penultimateRewardedPromoPoints,
    }
}

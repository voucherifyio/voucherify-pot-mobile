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

export const pointsCalculation = (activities: Record<string, any>[]) => {
    const lastCustomerRewardedJourniePoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM
    )
    const lastCustomerRewardedPromoPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM
    )
    const penultimateCustomerRewardedPromoPoints = activities.find(
        (event) =>
            event.type ===
                EVENT_TYPES.CUSTOMER_VOUCHER_LOYALTY_CARD_POINTS_ADDED &&
            event.data.voucher.campaign ===
                CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM &&
            event.data.balance.points >= 1
    )

    return {
        lastCustomerRewardedJourniePoints,
        lastCustomerRewardedPromoPoints,
        penultimateCustomerRewardedPromoPoints,
    }
}

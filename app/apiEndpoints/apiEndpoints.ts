import { CAMPAIGNS } from '@/enum/campaigns'
import { Deal } from '../components/deals/deals'

const getQualifications = async (
    customerId: string | null | undefined,
    scenario: string
) => {
    return await fetch(`/api/voucherify/qualifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerId,
            scenario,
        }),
    })
}

const getBarcode = async (item: Deal) => {
    return await fetch(`/api/voucherify/voucher-barcode?coupon=${item.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
}

const getCustomer = async (customerPhone: string) => {
    return await fetch(`/api/voucherify/get-customer?phone=${customerPhone}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
}

const getEarningRules = async (campaignName: string) => {
    return await fetch(
        `/api/voucherify/list-earning-rules?campaignId=${campaignName}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
    )
}

const getLoyaltyCard = async (customerId: string) => {
    return await fetch(
        `/api/voucherify/loyalty-card?customerId=${customerId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
    )
}

const redeemReward = async (
    customerId: string | undefined,
    rewardId: string,
    campaignName: string
) => {
    return await fetch(`/api/voucherify/redeem-reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerId,
            rewardId,
            campaignName,
        }),
    })
}

const redeemRewardWithMemberId = async (
    cardNumber: string,
    campaignId: string,
    rewardId: string
) => {
    return await fetch(`/api/voucherify/redeem-reward-with-member-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            memberId: cardNumber,
            campaignId: CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM_ID,
            rewardId: rewardId,
        }),
    })
}

const getReward = async (rewardId: string) => {
    return await fetch(`api/voucherify/get-reward?rewardId=${rewardId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
}

const getMemberRewards = async (
    customerId: string | null | undefined,
    campaignName: string
) => {
    return await fetch(
        `api/voucherify/list-member-rewards?customerId=${customerId}&campaignName=${campaignName}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}

export {
    getQualifications,
    getBarcode,
    getCustomer,
    getEarningRules,
    getLoyaltyCard,
    getReward,
    redeemReward,
    redeemRewardWithMemberId,
    getMemberRewards,
}

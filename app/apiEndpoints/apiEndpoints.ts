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

const updateCustomer = async (
    customerId: string,
    isVoucherifyMember: boolean
) => {
    return await fetch(`/api/voucherify/update-customer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            source_id: customerId,
            metadata: { voucherify_member: isVoucherifyMember },
        }),
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
    rewardId: string | undefined,
    campaignName: string | undefined
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

const getCampaign = async (campaignName: string) => {
    return await fetch(
        `/api/voucherify/get-campaign?campaignId=${campaignName}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
    )
}

const listCustomerSegments = async (customerId: string) => {
    return await fetch(
        `/api/voucherify/list-customers-segments?customerId=${customerId}`,
        {
            method: 'GET',
        }
    )
}

const listCustomerActivities = async (customerId: string) => {
    return await fetch(
        `/api/voucherify/list-customer-activities?customerId=${customerId}`,
        {
            method: 'GET',
        }
    )
}

const listCampaigns = async () => {
    return await fetch(`/api/voucherify/list-campaigns`, {
        method: 'GET',
        cache: 'no-cache',
    })
}

const listRewards = async () => {
    return await fetch(`/api/voucherify/list-rewards`, {
        method: 'GET',
    })
}

const listVouchers = async (
    customerSourceId: string | null | undefined,
    campaignName: string
) => {
    return await fetch(
        `/api/voucherify/list-vouchers?customerSourceId=${customerSourceId}&campaignName=${campaignName}`,
        {
            method: 'GET',
        }
    )
}

export {
    getQualifications,
    getBarcode,
    getCustomer,
    updateCustomer,
    getEarningRules,
    getLoyaltyCard,
    getReward,
    redeemReward,
    getMemberRewards,
    getCampaign,
    listCustomerSegments,
    listCustomerActivities,
    listCampaigns,
    listRewards,
    listVouchers,
}

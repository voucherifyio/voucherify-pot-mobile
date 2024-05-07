import { VouchersResponse } from '@voucherify/sdk'
import { listVouchers } from '../apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useState } from 'react'

export type BasicLoyaltyCampaignsInfo = {
    name: string | undefined
    id: string | undefined
    loyaltyPoints: number | undefined
    isActive: boolean
}

interface GeneratedVouchersResponse extends VouchersResponse {
    campaign_id: string
    loyalty_card?: { points: number; balance: number } | undefined
}

const loyaltyCampaigns = [
    CAMPAIGNS.MILESTONE_REWARDS_PROGRAM,
    CAMPAIGNS.LOYALTY_PROGRAM,
    CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN,
]

export const useLoyaltyData = () => {
    const [error, setError] = useState<string | undefined>(undefined)

    const getLoyaltyCampaignInfo = async (
        customerSourceId: string | null | undefined,
        campaignName: string
    ) => {
        const res = await listVouchers(customerSourceId, campaignName)
        const { vouchers }: { vouchers: GeneratedVouchersResponse[] } =
            await res.json()

        if (!vouchers[0]?.id) {
            return
        }

        return {
            name: vouchers[0]?.campaign,
            id: vouchers[0]?.campaign_id,
            loyaltyPoints: vouchers[0]?.loyalty_card?.balance,
            isActive: vouchers[0]?.active,
        } as BasicLoyaltyCampaignsInfo
    }

    const validateLoyaltyCampaigns = async (
        customerSourceId: string | null | undefined
    ): Promise<BasicLoyaltyCampaignsInfo[]> => {
        const activeCampaigns = await Promise.all(
            loyaltyCampaigns.map(
                async (activeCampaign) =>
                    await getLoyaltyCampaignInfo(
                        customerSourceId,
                        activeCampaign
                    )
            )
        )

        const isMoreLoyaltyCampaignsThanOne = [
            CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID,
            CAMPAIGNS.LOYALTY_PROGRAM_ID,
        ].every((campaign) =>
            activeCampaigns.find(
                (activeCampaign) => activeCampaign?.id === campaign
            )
        )

        if (isMoreLoyaltyCampaignsThanOne) {
            setError(
                `You have activated two loyalty programs (Loyalty Program, Loyalty Program - earn and burn). Disable one of them for the app to work properly.`
            )
        }

        return activeCampaigns.filter(
            (campaign) => !!campaign?.id
        ) as BasicLoyaltyCampaignsInfo[]
    }

    return {
        validateLoyaltyCampaigns,
        error,
    }
}

import { CampaignResponse, VouchersResponse } from '@voucherify/sdk'
import {
    getCampaign,
    listCampaigns,
    listVouchers,
} from '../apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useEffect, useState } from 'react'
import { WebhookResponse } from '@/types/webhook-response'
import { io } from 'socket.io-client'
const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL}`)

export type BasicLoyaltyCampaignsInfo = {
    name: string | undefined
    id: string | undefined
    loyaltyPoints: number
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

export const useLoyalty = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0)
    const [rewardPoints, setRewardPoints] = useState<number>(0)
    const [loyaltyError, setLoyaltyError] = useState<string | undefined>(
        undefined
    )
    const [loyaltyCampaignName, setLoyaltyCampaignName] = useState<
        string | undefined
    >()

    useEffect(() => {
        socket.on('send-data', (res: WebhookResponse) => {
            if (customerId === res.data.customer.id) {
                updateLoyaltyPoints(res)
            }
        })
    }, [socket, customerId])

    const loadInitialPoints = async (
        customerSourceId: string | null | undefined
    ) => {
        if (customerSourceId) {
            const loyaltyCampaigns =
                await validateLoyaltyCampaigns(customerSourceId)

            setLoyaltyPoints(
                loyaltyCampaigns?.find((campaign) =>
                    [
                        CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID,
                        CAMPAIGNS.LOYALTY_PROGRAM_ID,
                    ].includes(campaign.id as CAMPAIGNS)
                )?.loyaltyPoints || 0
            )

            setRewardPoints(
                loyaltyCampaigns?.find(
                    (campaign) =>
                        campaign?.id === CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID
                )?.loyaltyPoints || 0
            )
        }
    }

    const updateLoyaltyPoints = async (res: WebhookResponse) => {
        if (
            res.data.voucher.campaign_id === CAMPAIGNS.LOYALTY_PROGRAM_ID ||
            res.data.voucher.campaign_id ===
                CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID
        ) {
            setLoyaltyPoints(res.data.voucher.loyalty_card.balance)
        }

        if (
            res.data.voucher.campaign_id ===
            CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID
        ) {
            setRewardPoints(res.data.voucher.loyalty_card.balance)
        }
    }

    const getLoyaltyCampaignInfo = async (
        customerSourceId: string | null | undefined,
        campaignName: string
    ) => {
        const res = await listVouchers(customerSourceId, campaignName)
        const { vouchers }: { vouchers: GeneratedVouchersResponse[] } =
            await res.json()

        if (!vouchers[0]?.id) {
            return null
        }

        return {
            name: vouchers[0].campaign,
            id: vouchers[0].campaign_id,
            loyaltyPoints: vouchers[0].loyalty_card?.balance,
            isActive: vouchers[0].active,
        } as BasicLoyaltyCampaignsInfo
    }

    const validateLoyaltyCampaigns = async (
        customerSourceId: string | null | undefined
    ): Promise<BasicLoyaltyCampaignsInfo[] | void> => {
        const res = await getCampaign(CAMPAIGNS.LOYALTY_PROGRAM_ID)

        if (res.status === 404) {
            return setLoyaltyError(
                `Could not get Loyalty Program - check if campaign is not deleted in Voucherify dashboard.`
            )
        }

        const res2 = await getCampaign(
            CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID
        )

        if (res2.status === 404) {
            return setLoyaltyError(
                `Could not get Loyalty Program - earn and burn - check if campaign is not deleted in Voucherify dashboard.`
            )
        }
        const { campaign: loyaltyProgram } = await res.json()
        const { campaign: earnAndBurnProgram } = await res2.json()

        const campaigns = [loyaltyProgram, earnAndBurnProgram]

        const isActiveMultipleLoyaltyCampaigns = campaigns.every(
            (campaign) => campaign.active
        )

        if (isActiveMultipleLoyaltyCampaigns) {
            return setLoyaltyError(
                `You have activated two loyalty programs (Loyalty Program, Loyalty Program - earn and burn). Disable one of them for the app to work properly.`
            )
        }
        const inactiveLoyaltyCampaigns = campaigns.every(
            (campaign) => !campaign.active
        )

        if (inactiveLoyaltyCampaigns) {
            return setLoyaltyError(
                `For some reason, none of the loyalty campaigns are active for the user.`
            )
        }

        const activeCampaigns = await Promise.all(
            loyaltyCampaigns.map(
                async (activeCampaign) =>
                    await getLoyaltyCampaignInfo(
                        customerSourceId,
                        activeCampaign
                    )
            )
        )

        setLoyaltyCampaignName(
            activeCampaigns
                .filter((campaign) => !!campaign)
                .find(
                    (campaign) =>
                        (campaign?.isActive &&
                            campaign?.name ===
                                CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN) ||
                        (campaign?.isActive &&
                            campaign.name === CAMPAIGNS.LOYALTY_PROGRAM)
                )?.name
        )

        return activeCampaigns.filter(
            (campaign) => !!campaign?.isActive
        ) as BasicLoyaltyCampaignsInfo[]
    }

    return {
        loyaltyError,
        loyaltyCampaignName,
        loadInitialPoints,
        loyaltyPoints,
        rewardPoints,
    }
}

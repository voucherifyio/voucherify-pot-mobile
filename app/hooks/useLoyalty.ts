import { VouchersResponse } from '@voucherify/sdk'
import { listVouchers } from '../apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useEffect, useState } from 'react'
import { WebhookResponse } from '@/types/webhook-response'
import { io } from 'socket.io-client'
import { useSession } from 'next-auth/react'
// const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL}`)

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
    const { data: session } = useSession()
    console.log(session, 'ssss')

    useEffect(() => {
        const socket = io('http://localhost:3001', {
            auth: { token: session?.user?.token, userId: session?.user?.id },
            withCredentials: true,
        })
        // socket.on(`${session?.user?.id}`, (res) => {
        //     console.log(res, "RESPONSE")
        // })

        socket.on('send-data', (res: WebhookResponse) => {
            if (customerId === res.data.customer.id) {
                updateLoyaltyPoints(res)
            }
        })
    }, [customerId, session])

    const loadInitialPoints = async (
        customerSourceId: string | null | undefined
    ) => {
        if (customerSourceId) {
            const loyaltyCampaigns =
                await validateLoyaltyCampaigns(customerSourceId)

            setLoyaltyPoints(
                loyaltyCampaigns.find((campaign) =>
                    [
                        CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID,
                        CAMPAIGNS.LOYALTY_PROGRAM_ID,
                    ].includes(campaign.id as CAMPAIGNS)
                )?.loyaltyPoints || 0
            )

            setRewardPoints(
                loyaltyCampaigns.find(
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
        const validCampaigns = activeCampaigns.filter((campaign) => !!campaign)

        const isMoreLoyaltyCampaignsThanOne = [
            CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID,
            CAMPAIGNS.LOYALTY_PROGRAM_ID,
        ].every((campaign) =>
            validCampaigns.find(
                (activeCampaign) =>
                    activeCampaign?.id === campaign && activeCampaign.isActive
            )
        )

        if (isMoreLoyaltyCampaignsThanOne) {
            setLoyaltyError(
                `You have activated two loyalty programs (Loyalty Program, Loyalty Program - earn and burn). Disable one of them for the app to work properly.`
            )
        }

        const inactiveCampaigns = validCampaigns.every(
            (campaign) => !campaign?.isActive
        )

        if (inactiveCampaigns) {
            setLoyaltyError(
                `For some reason, none of the loyalty campaigns are active or the user is not part of an active campaign.`
            )
        }

        setLoyaltyCampaignName(
            validCampaigns
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

'use client'

import { CAMPAIGNS } from '@/enum/campaigns'
import { WebhookResponse } from '@/types/webhook-response'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

export const useUpdateLoyaltyPoints = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [loyaltyPoints, setLoyaltyPoints] = useState<number | undefined>(0)
    const [rewardPoints, setRewardPoints] = useState<number | undefined>(0)

    useEffect(() => {
        socket.on('send-data', (res: WebhookResponse) => {
            if (
                typeof res.data.balance.balance === 'number' &&
                customerId === res.data.customer.id
            ) {
                updateLoyaltyPoints(res)
            }
        })
    }, [socket, customerId])

    const updateLoyaltyPoints = async (res: WebhookResponse) => {
        if (
            res.data.voucher.campaign_id ===
            (CAMPAIGNS.LOYALTY_PROGRAM_ID ||
                CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID)
        ) {
            setLoyaltyPoints(res.data.balance.balance)
        }

        if (
            res.data.voucher.campaign_id ===
            CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID
        ) {
            setRewardPoints(res.data.balance.balance)
        }
    }

    return {
        loyaltyPoints,
        rewardPoints,
        setLoyaltyPoints,
        setRewardPoints,
    }
}

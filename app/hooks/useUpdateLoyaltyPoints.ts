'use client'

import { CAMPAIGNS } from '@/enum/campaigns'
import { WebhookResponse } from '@/types/webhook-response'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

export const useUpdateLoyaltyPoints = () => {
    const [websocket, setWebsocket] = useState()
    const [loyaltyPoints, setLoyaltyPoints] = useState<number | undefined>(0)
    const [rewardPoints, setRewardPoints] = useState<number | undefined>(0)

    useEffect(() => {
        socket.on('send-data', (res: WebhookResponse) => {
            if (res.data.balance.balance) {
                updateLoyaltyPoints(res)
            }
        })
    }, [socket])

    const updateLoyaltyPoints = async (res: WebhookResponse) => {
        if (
            res.data.voucher.campaign_id ===
            (CAMPAIGNS.LOYALTY_PROGRAM_ID ||
                CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID)
        ) {
            console.log('tutaj 1')
            setLoyaltyPoints(res.data.balance.balance)
        }

        if (
            res.data.voucher.campaign_id ===
            CAMPAIGNS.MILESTONE_REWARDS_PROGRAM_ID
        ) {
            console.log('tutaj 2')
            setRewardPoints(res.data.balance.balance)
        }
    }

    return {
        websocket,
        loyaltyPoints,
        rewardPoints,
        setLoyaltyPoints,
        setRewardPoints,
    }
}

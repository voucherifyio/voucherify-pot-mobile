'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { useGetCustomer } from '@/app/hooks/useGetCustomer'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useEffect, useState } from 'react'
import { useLoyaltyCard } from '@/app/hooks/useLoyaltyCard'
import { REWARDS } from '@/enum/rewards'

const Milestones = () => {
    const { customer } = useGetCustomer()
    const mainLoyaltyPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points || 0
    const promoPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
            ?.points || 0
    const customerId = customer?.id
    const { cardNumber } = useLoyaltyCard({
        customerId,
    })

    useEffect(() => {
        const redeemReward = async (rewardId: string) => {
            if (cardNumber) {
                try {
                    const res = await fetch(
                        `/api/voucherify/redeem-reward-with-member-id`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                memberId: cardNumber,
                                campaignId:
                                    CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM_ID,
                                rewardId: rewardId,
                            }),
                        }
                    )
                    const data = await res.json()
                    if (res.status !== 200) {
                        console.log(data)
                    }
                } catch (err) {}
            }
        }
        if (
            mainLoyaltyPoints >= 300 &&
            customer?.metadata?.aeroplan_member === true
        ) {
            redeemReward(REWARDS.AEROPLAN_TRANSFER_REWARD_ID).catch((err) =>
                console.error(err)
            )
        } else if (
            mainLoyaltyPoints >= 300 &&
            customer?.metadata?.aeroplan_member === false
        ) {
            redeemReward(REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID).catch((err) =>
                console.error(err)
            )
        }
    }, [mainLoyaltyPoints, customer])

    return (
        <div className="p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">
                        {mainLoyaltyPoints}
                    </span>
                </h4>
            </header>
            <MilestoneChart
                mainLoyaltyPoints={mainLoyaltyPoints}
                customerId={customer?.id}
                promoPoints={promoPoints}
            />
        </div>
    )
}

export default Milestones

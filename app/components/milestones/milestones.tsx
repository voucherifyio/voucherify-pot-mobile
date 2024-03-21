'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { useGetCustomer } from '@/app/hooks/useGetCustomer'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useEffect, useState } from 'react'
import { useLoyaltyCard } from '@/app/hooks/useLoyaltyCard'
import Toast from '@/app/components/ui/atoms/toast'
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
    const [successMessage, setSuccessMessage] = useState<string>('')

    useEffect(() => {
        const autoRedeemReward = async (rewardId: string) => {
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
        if (
            cardNumber &&
            mainLoyaltyPoints >= 300 &&
            promoPoints === 0 &&
            customer?.metadata?.aeroplan_member === true
        ) {
            autoRedeemReward(REWARDS.AEROPLAN_TRANSFER_REWARD_ID)
                .then(() =>
                    setSuccessMessage(
                        `Successfully redeemed reward - ${REWARDS.AEROPLAN_TRANSFER_REWARD}`
                    )
                )
                .catch((err) => {
                    console.error(err)
                })
        } else if (
            cardNumber &&
            mainLoyaltyPoints >= 300 &&
            promoPoints === 0 &&
            (customer?.metadata?.aeroplan_member === false ||
                !customer?.metadata?.aeroplan_member)
        ) {
            autoRedeemReward(REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID)
                .then(() =>
                    setSuccessMessage(
                        `Successfully redeemed reward - ${REWARDS.SEVEN_CENTS_PER_LITER_REWARD}`
                    )
                )
                .catch((err) => {
                    console.error(err)
                })
        }
    }, [mainLoyaltyPoints, promoPoints, cardNumber, customer])

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
            {successMessage && (
                <Toast toastType="success" toastText={successMessage} />
            )}
        </div>
    )
}

export default Milestones

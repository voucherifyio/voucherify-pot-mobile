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
            ?.points ?? null
    const customerId = customer?.id
    const { cardNumber } = useLoyaltyCard({
        customerId,
    })
    const [successMessage, setSuccessMessage] = useState<string | null>('')
    const [errorMessage, setErrorMessage] = useState<string | null>()
    const [redeemedAeroplanRewardOnce, setRedeemedAeroplanRewardOnce] =
        useState<boolean | undefined>(undefined)
    const [
        redeemedGasolineDiscountsRewardOnce,
        setRedeemedGasolineDiscountRewardOnce,
    ] = useState<boolean | undefined>(undefined)
    const [autoredeemInProgress, setAutoredeemInProgress] = useState(false)

    const triggerRedeemReward = () => {
        if (
            !redeemedAeroplanRewardOnce &&
            cardNumber &&
            mainLoyaltyPoints >= 300 &&
            promoPoints === 0 &&
            customer?.metadata?.aeroplan_member === true
        ) {
            autoRedeemReward(
                REWARDS.AEROPLAN_TRANSFER_REWARD_ID,
                REWARDS.AEROPLAN_TRANSFER_REWARD
            )
                .then(() => {
                    setRedeemedAeroplanRewardOnce(true)
                })
                .catch((err) => {
                    console.error(err)
                })
        } else if (
            !redeemedGasolineDiscountsRewardOnce &&
            cardNumber &&
            mainLoyaltyPoints >= 300 &&
            promoPoints === 0 &&
            (customer?.metadata?.aeroplan_member === false ||
                !customer?.metadata?.aeroplan_member)
        ) {
            autoRedeemReward(
                REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID,
                REWARDS.SEVEN_CENTS_PER_LITER_REWARD
            )
                .then(() => {
                    setRedeemedGasolineDiscountRewardOnce(true)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const autoRedeemReward = async (rewardId: string, rewardName: string) => {
        try {
            setAutoredeemInProgress(true)
            const res = await fetch(
                `/api/voucherify/redeem-reward-with-member-id`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        memberId: cardNumber,
                        campaignId: CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM_ID,
                        rewardId: rewardId,
                    }),
                }
            )
            if (res.status !== 200) {
                setErrorMessage(`Redemption failed.`)
                setAutoredeemInProgress(false)
            }
            if (res.status === 200) {
                setAutoredeemInProgress(false)
                setSuccessMessage(
                    `Successfully redeemed reward - ${rewardName}`
                )
                return
            }
        } catch (err) {
            console.error(err)
            setErrorMessage(`Error: ${err}`)
            setAutoredeemInProgress(false)
        }
    }

    useEffect(() => {
        triggerRedeemReward()
    }, [customer])

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
            {errorMessage && (
                <Toast toastType="error" toastText={errorMessage} />
            )}
        </div>
    )
}

export default Milestones

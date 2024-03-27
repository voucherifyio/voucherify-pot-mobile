'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { REWARDS } from '@/enum/rewards'
import { MobileAppContext } from '../app-context/app-context'
import { redeemReward } from '@/app/apiEndpoints/apiEndpoints'

const Milestones = () => {
    const { customer, getCurrentCustomer } = useContext(MobileAppContext)
    const mainLoyaltyPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points || 0
    const promoPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
            ?.points || 0
    const [successMessage, setSuccessMessage] = useState<string | null>('')
    const [errorMessage, setErrorMessage] = useState<string | null>()
    const pointsCondition = mainLoyaltyPoints >= 300 && promoPoints === 0
    
    useEffect(() => {
        const autoRedeemReward = async () => {
            const aeroplan = customer?.metadata.aeroplan_member
            let res
            if (pointsCondition && aeroplan) {
                res = await redeemReward(
                    customer.id,
                    REWARDS.AEROPLAN_TRANSFER_REWARD_ID,
                    CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM
                )
            }

            if (pointsCondition && !aeroplan) {
                res = await redeemReward(
                    customer?.id,
                    REWARDS.SEVEN_CENTS_PER_LITER_REWARD_ID,
                    CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM
                )
            }
            if (res && res?.status !== 200) {
                setErrorMessage(`Redemption failed.`)
            }
            if (res && res?.status === 200) {
                setSuccessMessage(
                    `Successfully redeemed reward - ${aeroplan ? REWARDS.AEROPLAN_TRANSFER_REWARD : REWARDS.SEVEN_CENTS_PER_LITER_REWARD}`
                )
                await getCurrentCustomer()
            }
        }

        autoRedeemReward()
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

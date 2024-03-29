'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useContext, useEffect } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'
import { useAutoRedeem } from '@/app/hooks/useAutoRedeem'

const Milestones = () => {
    const { customer } = useContext(MobileAppContext)
    const {
        restNotRedeemedPoints,
        autoRedeemCalculation,
        error,
        successMessage,
    } = useAutoRedeem()
    const journiePoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points || 0
    const promoPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
            ?.points || 0

    useEffect(() => {
        autoRedeemCalculation(customer)
    }, [journiePoints, promoPoints])

    const journiePointsCalculated =
        restNotRedeemedPoints === 0 || restNotRedeemedPoints
            ? restNotRedeemedPoints
            : journiePoints

    return (
        <div className="p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">
                        {journiePointsCalculated}
                    </span>
                </h4>
            </header>
            <MilestoneChart
                journiePoints={journiePointsCalculated}
                customerId={customer?.id}
                promoPoints={promoPoints}
            />
            {successMessage && (
                <Toast toastType="success" toastText={successMessage} />
            )}
            {error && <Toast toastType="error" toastText={error} />}
        </div>
    )
}

export default Milestones

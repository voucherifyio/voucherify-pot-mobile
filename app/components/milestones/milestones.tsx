'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'

const Milestones = () => {
    const {
        autoRedeemError,
        autoRedeemSuccessMessage,
        unredeemedPoints,
        isCustomerUpdated,
        journiePoints,
        promoPoints,
    } = useContext(MobileAppContext)
    const [calculatedJourniePoints, setCalculatedJourniePoints] =
        useState<number>(journiePoints || 0)
    const [isRewardButtonVisible, setIsRewardButtonVisible] = useState(false)

    useEffect(() => {
        if (journiePoints && isCustomerUpdated) {
            setCalculatedJourniePoints(journiePoints)
        }
        if (unredeemedPoints && !isCustomerUpdated) {
            setCalculatedJourniePoints(unredeemedPoints)
        }
        if (promoPoints && promoPoints >= 1) {
            setIsRewardButtonVisible(true)
        }
    }, [journiePoints, unredeemedPoints, promoPoints])

    return (
        <div className="p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">
                        {calculatedJourniePoints}
                    </span>
                </h4>
            </header>

            <MilestoneChart
                calculatedJourniePoints={calculatedJourniePoints}
                isRewardButtonVisible={isRewardButtonVisible}
                setIsRewardButtonVisible={setIsRewardButtonVisible}
            />
            {autoRedeemSuccessMessage && (
                <Toast
                    toastType="success"
                    toastText={autoRedeemSuccessMessage}
                />
            )}
            {autoRedeemError && (
                <Toast toastType="error" toastText={autoRedeemError} />
            )}
        </div>
    )
}

export default Milestones

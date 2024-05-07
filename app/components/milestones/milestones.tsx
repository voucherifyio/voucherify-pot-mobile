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
        loyaltyPoints,
        rewardPoints,
        customer,
    } = useContext(MobileAppContext)
    const [isRewardButtonVisible, setIsRewardButtonVisible] = useState(false)

    const isRewardPoints = typeof rewardPoints === 'number' && rewardPoints >= 1

    useEffect(() => {
        // if (typeof unredeemedPoints === 'number') {
        //     setCalculatedLoyaltyPoints(unredeemedPoints)
        // }
        if (isRewardPoints) {
            setIsRewardButtonVisible(true)
        }
    }, [loyaltyPoints, rewardPoints])

    return (
        <div className="px-4 p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">
                        {!customer ? null : loyaltyPoints || 0}
                    </span>
                </h4>
            </header>

            <MilestoneChart
                loyaltyPoints={loyaltyPoints || 0}
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

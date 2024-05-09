'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'
import { PulseLoader } from 'react-spinners'

const toastStyles =
    'font-bold border border-gray-300 rounded-lg shadow-lg fixed top-[15%] left-[50%] -translate-x-2/4 flex items-center justify-center w-full max-w-xs p-4 bg-white z-50'

const Milestones = () => {
    const {
        autoRedeemError,
        autoRedeemSuccessMessage,
        loyaltyPoints,
        rewardPoints,
        customer,
        rewardErrorMessage,
        rewardSuccessMessage,
        loyaltyPointsCalculation,
        setLoyaltyPointsCalulcation,
    } = useContext(MobileAppContext)
    const [calculatedLoyaltyPoints, setCalculatedLoyaltyPoints] =
        useState<number>(loyaltyPoints)
    const [calculatedRewardPoints, setCalculatedRewardPoints] =
        useState(rewardPoints)

    const isRewardPoints = typeof rewardPoints === 'number' && rewardPoints > 0

    useEffect(() => {
        if (
            typeof loyaltyPoints === 'number' &&
            loyaltyPoints !== calculatedLoyaltyPoints
        ) {
            setCalculatedLoyaltyPoints(loyaltyPoints)
            setLoyaltyPointsCalulcation(false)
        }

        if (isRewardPoints) {
            setCalculatedRewardPoints(rewardPoints)
        }
    }, [loyaltyPoints, rewardPoints])

    return (
        <div className="px-4 p-4">
            {rewardErrorMessage && (
                <Toast
                    toastType="error"
                    toastText={rewardErrorMessage}
                    customStyles={toastStyles}
                />
            )}
            {rewardSuccessMessage && (
                <Toast
                    toastType="success"
                    toastText={rewardSuccessMessage}
                    customStyles={toastStyles}
                />
            )}
            <h4 className="text-blue-text text-16 mb-2">
                Your Points
                <span className="pl-2 font-extrabold">
                    {!customer ? (
                        <PulseLoader size={5} color="#173c9f" />
                    ) : loyaltyPointsCalculation ? (
                        <PulseLoader size={5} color="#173c9f" />
                    ) : (
                        calculatedLoyaltyPoints
                    )}
                </span>
            </h4>

            <MilestoneChart
                calculatedLoyaltyPoints={calculatedLoyaltyPoints}
                calculatedRewardPoints={calculatedRewardPoints}
                setCalculatedRewardPoints={setCalculatedRewardPoints}
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

'use client'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'
import { PulseLoader } from 'react-spinners'
import HomeImage from '@/public/images/oreilly-home.png'
import Image from 'next/image'
import { Progress } from '@chakra-ui/react'
import { V_COLOR } from '../../../enum/v-colors'
import { APP_DETAILS } from '../../../enum/app-details'

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
        isLoyaltyPointsCalculated,
        loyaltyCampaignName,
        setIsLoyaltyPointsCalculated,
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
            setIsLoyaltyPointsCalculated(false)
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
            <div className="flex flex-col gap-4">
                <h1 className="font-extrabold text-[30px]">{APP_DETAILS.app_name}</h1>
                <Image src={HomeImage} alt="home-image" />
                <div className="bg-gray-100 rounded-lg p-4">
                    {!customer ? (
                        <PulseLoader size={5} color="#173c9f" />
                    ) : isLoyaltyPointsCalculated ? (
                        <PulseLoader size={5} color="#173c9f" />
                    ) : (
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-700 font-medium">
                                <span className="font-extrabold text-black text-xl">
                                    {calculatedLoyaltyPoints.toLocaleString()}
                                </span>{' '}
                                points
                            </p>
                            <Progress
                                value={calculatedLoyaltyPoints / 100}
                                bg={V_COLOR.GRAY}
                                height="10px"
                                borderRadius="50px"
                                sx={{
                                    "& div[role='progressbar']": {
                                        backgroundColor: V_COLOR.BLUE,
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
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

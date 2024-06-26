'use client'
import { Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import RewardsModal from '@/app/components/rewards-modal/rewards-modal'
import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { MobileAppContext } from '../app-context/app-context'
import Button from '../ui/atoms/button'

type MilestoneChartProps = {
    calculatedLoyaltyPoints: number
    calculatedRewardPoints: number
    setCalculatedRewardPoints: Dispatch<SetStateAction<number>>
}

const MilestoneChart: FC<MilestoneChartProps> = ({
    calculatedLoyaltyPoints,
    calculatedRewardPoints,
    setCalculatedRewardPoints,
}) => {
    const { customer } = useContext(MobileAppContext)
    const [rewards, setRewards] = useState([])
    const [rewardModalOpened, setRewardModalOpened] = useState(false)
    const [loading, setLoading] = useState(true)

    const listMemberRewards = async (customerId: string | null | undefined) => {
        const res = await getMemberRewards(
            customerId,
            CAMPAIGNS.MILESTONE_REWARDS_PROGRAM
        )
        const { rewards } = await res.json()
        if (res.status !== 200) {
            return false
        }
        setRewards(rewards)
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-8 py-3">
            <ol className="flex items-center">
                <li className="relative w-full">
                    <div
                        className={`${calculatedLoyaltyPoints < 1 ? 'bg-gray-300' : 'bg-green-background'} absolute top-1/2 -left-1 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white`}
                    >
                        <p className="bg-blue-button rounded-full text-[12px]">
                            {calculatedLoyaltyPoints < 150
                                ? calculatedLoyaltyPoints
                                : 0}
                        </p>
                    </div>
                    <div
                        className={`${calculatedLoyaltyPoints < 37.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={`bg-white w-1 h-2 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedLoyaltyPoints < 75 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={`bg-white w-1 h-2 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedLoyaltyPoints < 112.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={` bg-white w-1 h-2 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedLoyaltyPoints < 150 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedLoyaltyPoints < 150 ? 'bg-gray-300' : 'bg-green-background'} absolute top-1/2 -left-3 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white`}
                    >
                        <p className="bg-blue-button rounded-full text-[12px]">
                            {calculatedLoyaltyPoints >= 150 &&
                            calculatedLoyaltyPoints < 300
                                ? calculatedLoyaltyPoints
                                : 150}
                        </p>
                    </div>
                    <div
                        className={`${calculatedLoyaltyPoints < 187.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={` bg-white w-1 h-2 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${(calculatedLoyaltyPoints || 0) < 225 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={` bg-white w-1 h-2 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedLoyaltyPoints < 262.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={`bg-white w-1 h-2 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedLoyaltyPoints < 300 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                    <div
                        className={`${calculatedLoyaltyPoints < 300 ? 'bg-gray-300' : 'bg-green-background'} absolute top-1/2 -right-1 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white`}
                    >
                        <p className="bg-blue-button rounded-full text-[12px]">
                            {calculatedLoyaltyPoints >= 300
                                ? calculatedLoyaltyPoints
                                : 300}
                        </p>
                    </div>
                </li>
            </ol>
            {calculatedRewardPoints >= 1 ? (
                <div className="flex justify-center">
                    {rewardModalOpened ? (
                        <RewardsModal
                            rewards={rewards}
                            rewardModalOpened={rewardModalOpened}
                            setRewardModalOpened={setRewardModalOpened}
                            loading={loading}
                            setCalculatedRewardPoints={
                                setCalculatedRewardPoints
                            }
                        />
                    ) : null}
                    <Button
                        buttonType="primary"
                        onClick={() => {
                            listMemberRewards(customer?.id)
                            setRewardModalOpened(true)
                        }}
                        className="text-white bg-[#173C9F] h-[32px] rounded text-[16px] px-2"
                    >
                        Choose reward
                    </Button>
                </div>
            ) : null}
        </div>
    )
}

export default MilestoneChart

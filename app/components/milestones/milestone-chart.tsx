'use client'
import { useState } from 'react'
import { MdLock, MdOutlineLocalGasStation } from 'react-icons/md'
import RewardsModal from '@/app/components/rewards-modal/rewards-modal'
import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'

interface MilestoneChartProps {
    mainLoyaltyPoints: number
    promoPoints?: number | null
    customerId: string | null | undefined
}
const MilestoneChart: React.FC<MilestoneChartProps> = ({
    mainLoyaltyPoints,
    promoPoints,
    customerId,
}) => {
    const [rewards, setRewards] = useState([])
    const [rewardModalOpened, setRewardModalOpened] = useState(false)
    const [loading, setLoading] = useState(true)

    const listMemberRewards = async (customerId: string | null | undefined) => {
        const res = await getMemberRewards(customerId)
        const { rewards } = await res.json()
        if (res.status !== 200) {
            return false
        }
        setRewards(rewards)
        setLoading(false)
    }

    return (
        <div className="py-2">
            <ol className="items-center flex">
                <li className="relative w-full mb-6">
                    <div className="text-left text-blue-text mb-2 ml-2 font-bold">
                        <p className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            0
                        </p>
                    </div>
                    <div
                        className={`${mainLoyaltyPoints < 37.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2 z-0`}
                    />
                    <div
                        className={`relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        <MdOutlineLocalGasStation />
                    </div>
                </li>
                <li className="relative w-full">
                    <div
                        className={`${mainLoyaltyPoints < 75 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={`bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${mainLoyaltyPoints < 112.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={`bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${mainLoyaltyPoints < 150 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full mb-6">
                    <div className="text-left text-blue-text mb-2 font-bold">
                        <p className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            150
                        </p>
                    </div>
                    <div
                        className={`${mainLoyaltyPoints < 187.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={`${mainLoyaltyPoints < 150 ? 'bg-gray-300' : 'bg-yellow-button'} relative bottom-4 w-6 h-6 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        {mainLoyaltyPoints < 150 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                </li>
                <li className="relative w-full">
                    <div
                        className={`${mainLoyaltyPoints < 225 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${mainLoyaltyPoints < 262.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${mainLoyaltyPoints < 300 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative mb-6">
                    <div className="text-left text-blue-text mb-2 font-bold">
                        <p className="bg-blue-button rounded-full focus:border-blue-300 text-[12px]">
                            300
                        </p>
                    </div>
                    <div
                        className={`flex  ${mainLoyaltyPoints < 10000 ? 'bg-gray-300' : 'bg-yellow-button'} h-2`}
                    />
                    <div
                        className={`relative bottom-4 w-6 h-6 z-10 rounded-full flex items-center justify-center text-blue-text ${mainLoyaltyPoints < 300 ? 'bg-gray-300' : 'bg-yellow-button'}`}
                    >
                        {mainLoyaltyPoints < 300 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                </li>
            </ol>
            {promoPoints && promoPoints >= 1 && (
                <div className="flex justify-center relative">
                    {rewardModalOpened ? (
                        <RewardsModal
                            rewards={rewards}
                            rewardModalOpened={rewardModalOpened}
                            setRewardModalOpened={setRewardModalOpened}
                            customerId={customerId}
                            loading={loading}
                        />
                    ) : null}
                    <button
                        onClick={() => {
                            listMemberRewards(customerId)
                            setRewardModalOpened(true)
                        }}
                        className="text-white bg-[#173C9F] h-[32px] rounded text-[16px] px-2"
                    >
                        Choose
                    </button>
                </div>
            )}
        </div>
    )
}

export default MilestoneChart

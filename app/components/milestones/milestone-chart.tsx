'use client'
import { Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import { MdLock, MdOutlineLocalGasStation } from 'react-icons/md'
import RewardsModal from '@/app/components/rewards-modal/rewards-modal'
import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'

type MilestoneChartProps = {
    calculatedJourniePoints: number
    isRewardButtonVisible: boolean
    setIsRewardButtonVisible: Dispatch<SetStateAction<boolean>>
}

const MilestoneChart: FC<MilestoneChartProps> = ({
    calculatedJourniePoints,
    isRewardButtonVisible,
    setIsRewardButtonVisible,
}) => {
    const { customer, promoPoints } = useContext(MobileAppContext)
    const [rewards, setRewards] = useState([])
    const [rewardModalOpened, setRewardModalOpened] = useState(false)
    const [loading, setLoading] = useState(true)
    const [rewardGeneratedMessage, setRewardGeneratedMessage] = useState<
        string | undefined
    >(undefined)

    const listMemberRewards = async (customerId: string | null | undefined) => {
        const res = await getMemberRewards(
            customerId,
            CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM
        )
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
                        className={`${calculatedJourniePoints < 37.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2 z-0`}
                    />
                    <div
                        className={`relative bottom-4 w-6 h-6 bg-yellow-button z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        <MdOutlineLocalGasStation />
                    </div>
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 75 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={`bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 112.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={`bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 150 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
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
                        className={`${calculatedJourniePoints < 187.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 150 ? 'bg-gray-300' : 'bg-yellow-button'} relative bottom-4 w-6 h-6 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    >
                        {calculatedJourniePoints < 150 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 225 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 262.5 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
                    />
                    <div
                        className={` bg-white relative bottom-4 w-1 h-[9px] my-[7px] z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 300 ? 'bg-gray-300' : 'bg-yellow-button'} flex w-full h-2`}
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
                        className={`flex  ${calculatedJourniePoints < 10000 ? 'bg-gray-300' : 'bg-yellow-button'} h-2`}
                    />
                    <div
                        className={`relative bottom-4 w-6 h-6 z-10 rounded-full flex items-center justify-center text-blue-text ${calculatedJourniePoints < 300 ? 'bg-gray-300' : 'bg-yellow-button'}`}
                    >
                        {calculatedJourniePoints < 300 ? (
                            <MdLock />
                        ) : (
                            <MdOutlineLocalGasStation />
                        )}
                    </div>
                </li>
            </ol>
            {rewardGeneratedMessage && (
                <Toast
                    toastType="success"
                    toastText={rewardGeneratedMessage}
                    customStyles="font-bold border border-gray-300 rounded-lg shadow-lg fixed top-[15%] left-[50%] -translate-x-2/4 flex items-center justify-center w-full max-w-xs p-4 bg-white z-50"
                />
            )}
            {isRewardButtonVisible ? (
                <div className="flex justify-center relative">
                    {rewardModalOpened ? (
                        <RewardsModal
                            rewards={rewards}
                            rewardModalOpened={rewardModalOpened}
                            setRewardModalOpened={setRewardModalOpened}
                            customerId={customer?.id}
                            loading={loading}
                            setRewardGeneratedMessage={
                                setRewardGeneratedMessage
                            }
                            setIsRewardButtonVisible={setIsRewardButtonVisible}
                        />
                    ) : null}
                    <button
                        onClick={() => {
                            listMemberRewards(customer?.id)
                            setRewardModalOpened(true)
                        }}
                        className="text-white bg-[#173C9F] h-[32px] rounded text-[16px] px-2"
                    >
                        Choose reward
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default MilestoneChart

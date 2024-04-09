'use client'
import { Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import { MdLock, MdOutlineLocalGasStation } from 'react-icons/md'
import RewardsModal from '@/app/components/rewards-modal/rewards-modal'
import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'
import Button from '../ui/atoms/button'

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
        <div className="flex flex-col gap-8 py-3">
            <ol className="flex items-center">
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 150 ? 'bg-gray-300' : 'bg-green-background'} absolute top-1/2 -left-1 -translate-y-1/2 w-7 h-7 z-10 rounded-full flex items-center justify-center text-white`}
                    >
                        <p className="bg-blue-button rounded-full text-[12px]">
                            0
                        </p>
                    </div>
                    <div
                        className={`${calculatedJourniePoints < 37.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2 z-0`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={`bg-white w-1 h-2 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 75 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={`bg-white w-1 h-2 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 112.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={` bg-white w-1 h-2 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 150 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative w-full">
                    <div
                        className={`${calculatedJourniePoints < 150 ? 'bg-gray-300' : 'bg-green-background'} absolute top-1/2 -left-3 -translate-y-1/2 w-7 h-7 z-10 rounded-full flex items-center justify-center text-white`}
                    >
                        <p className="bg-blue-button rounded-full text-[12px]">
                            150
                        </p>
                    </div>
                    <div
                        className={`${calculatedJourniePoints < 187.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={` bg-white w-1 h-2 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 225 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={` bg-white w-1 h-2 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 262.5 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                </li>
                <li className="relative flex items-center w-full">
                    <div
                        className={`bg-white w-1 h-2 z-10 rounded-full flex items-center justify-center text-blue-text`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 300 ? 'bg-gray-300' : 'bg-green-background'} flex w-full h-2`}
                    />
                    <div
                        className={`${calculatedJourniePoints < 300 ? 'bg-gray-300' : 'bg-green-background'} absolute top-1/2 -right-1 -translate-y-1/2 w-7 h-7 z-10 rounded-full flex items-center justify-center text-white`}
                    >
                        <p className="bg-blue-button rounded-full text-[12px]">
                            300
                        </p>
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

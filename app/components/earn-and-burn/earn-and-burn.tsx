import { getMemberRewards, redeemReward } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import FirstImage from '@/public/images/v_background.png'
import SecondaryImage from '@/public/images/v_background_logo.jpeg'
import ThirdImage from '@/public/images/v_logo_2.png'
import {
    LoyaltiesListMemberRewardsResponseBody,
    Reward,
    RewardsAssignmentCampaignOrMaterialReward,
} from '@voucherify/sdk'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'
import { MobileAppContext } from '../app-context/app-context'
import Loading from '../loading/loading'
import Button from '../ui/atoms/button'
import Toast from '../ui/atoms/toast'

const V_IMAGES = [FirstImage, SecondaryImage, ThirdImage]

const toastStyles =
    'font-bold border border-gray-300 rounded-lg shadow-lg fixed top-[15%] left-[50%] -translate-x-2/4 flex items-center justify-center w-full max-w-xs p-4 bg-white z-50'

const EarnAndBurnRewards = () => {
    const [rewards, setRewards] = useState<
        LoyaltiesListMemberRewardsResponseBody['data'] | []
    >([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | undefined>(undefined)
    const { customer, rewardSuccessMessage, loyaltyPoints } =
        useContext(MobileAppContext)
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [activeReward, setActiveReward] = useState({
        rewardId: undefined,
        barcodeUrl: undefined,
    })
    const [isCouponClosed, setIsCouponClosed] = useState(true)

    const listMemberRewards = async (customerId: string | null | undefined) => {
        const res = await getMemberRewards(
            customerId,
            CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN
        )
        const { rewards, error } = await res.json()

        if (error) {
            setLoading(false)
            return setError(error)
        }
        setRewards(rewards)
        setLoading(false)
    }

    const handleScroll = (index: number) => {
        const scrollContainer = document.querySelector('.scroll-container')
        const firstItem = scrollContainer?.children[0]
        if (scrollContainer) {
            const itemWidth = firstItem?.getBoundingClientRect().width
            scrollContainer.scrollTo({
                left: index * (itemWidth || 300),
                behavior: 'smooth',
            })
        }
    }

    const handleRedeemReward = async (reward: Reward) => {
        const res = await redeemReward(
            customer?.id,
            reward.id,
            CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN
        )
        const { redeemedReward } = await res.json()

        if (redeemedReward.voucher.assets.barcode.url) {
            setActiveReward({
                barcodeUrl: redeemedReward.voucher.assets.barcode.url,
                rewardId: redeemedReward.reward.id,
            })
            setIsCouponClosed(false)
        }
    }

    useEffect(() => {
        if (customer?.id && isCouponClosed) {
            listMemberRewards(customer?.id)
        }
    }, [customer?.id, loyaltyPoints, isCouponClosed])

    if (loading) return <Loading className="text-white" />

    if (error)
        return (
            <div className="flex-1 w-full h-full flex justify-center items-center">
                <p className="mb-4 text-[14px] font-bold text-blue-text">
                    {error}
                </p>
            </div>
        )

    if (rewards.length === 0)
        return (
            <div className="flex-1 w-full h-full flex justify-center items-center">
                <p className="mb-4 text-[14px] font-bold text-white">
                    You don't have any rewards.
                </p>
            </div>
        )

    return (
        <div
            className="py-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {rewardSuccessMessage && (
                <Toast
                    toastType="success"
                    toastText={rewardSuccessMessage}
                    customStyles={toastStyles}
                />
            )}
            <p className="text-[24px] font-bold text-white mx-4 mb-4">
                Your Rewards
            </p>
            <p className="text-white mx-4">
                Get exclusive incentives and more with the points you’ve earned
            </p>
            <ScrollContainer
                className="scroll-container flex gap-4 m-4"
                component={'div'}
            >
                {rewards?.map(({ reward, assignment }, index) => (
                    <div
                        key={reward.id}
                        className="flex-1 flex-col justify-end shadow-md rounded-xl flex bg-white text-blue-text min-w-[85%] self-start"
                    >
                        <div className="relative h-[320px]">
                            <Image
                                src={V_IMAGES[index] || V_IMAGES[0]}
                                alt="Reward image"
                                fill
                                style={{objectFit: 'contain'}}
                                className="rounded-t-[8px]"
                            />
                        </div>
                        <div className="p-4 flex justify-between items-end">
                            <div className="">
                                <p className="font-bold text-black">
                                    {reward.name || reward.id}
                                </p>
                                <p className="text-[14px] text-black">
                                    {(
                                        assignment as RewardsAssignmentCampaignOrMaterialReward
                                    ).parameters.loyalty.points?.toLocaleString()}{' '}
                                    points
                                </p>
                            </div>
                            {!activeReward.rewardId && isCouponClosed ? (
                                <Button
                                    className="border px-4 py-1 rounded-full h-auto"
                                    onClick={() => handleRedeemReward(reward)}
                                >
                                    Redeem
                                </Button>
                            ) : activeReward.rewardId === reward.id ? (
                                <Button
                                    className="border px-4 py-1 rounded-full h-auto"
                                    onClick={() => {
                                        setIsCouponClosed(true)
                                        setActiveReward({
                                            barcodeUrl: undefined,
                                            rewardId: undefined,
                                        })
                                    }}
                                >
                                    Close
                                </Button>
                            ) : null}
                        </div>
                        {activeReward.rewardId === reward.id &&
                        activeReward.barcodeUrl ? (
                            <Image
                                src={activeReward.barcodeUrl}
                                alt="couponBarcode"
                                width={250}
                                height={65}
                                className="max-w-auto max-h-auto mx-auto"
                            />
                        ) : null}
                    </div>
                ))}
            </ScrollContainer>
            <div className="flex justify-center mt-6 gap-8">
                {rewards?.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            handleScroll(index)
                            setActiveIndex(index)
                        }}
                        className="h-2.5 w-2.5 text-white border rounded-full"
                        style={{
                            backgroundColor:
                                activeIndex === index ? 'white' : 'inherit',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default EarnAndBurnRewards

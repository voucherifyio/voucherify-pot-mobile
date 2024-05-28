'use client'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import ScrollContainer from 'react-indiana-drag-scroll'
import Button from '../ui/atoms/button'
import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { LoyaltiesListMemberRewardsResponseBody } from '@voucherify/sdk'
import { MobileAppContext } from '../app-context/app-context'
import { PulseLoader } from 'react-spinners'

const EarnAndBurnRewardsCarousel = () => {
    const router = useRouter()
    const [rewards, setRewards] = useState<
        LoyaltiesListMemberRewardsResponseBody['data'] | []
    >([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | undefined>(undefined)
    const { customer } = useContext(MobileAppContext)

    const listMemberRewards = async (customerId: string | null | undefined) => {
        if (customerId) {
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
    }

    useEffect(() => {
        listMemberRewards(customer?.id)
    }, [customer?.id])

    const handleBurnRewardsRedirectClick = () => {
        router.push('/earn-and-burn')
    }

    return (
        <>
            <div className="flex justify-between mx-5">
                <h1 className="text-blue-text text-18 font-bold">
                    Burning rewards
                </h1>
                {!rewards.length || error ? null : (
                    <Button
                        onClick={handleBurnRewardsRedirectClick}
                        className="flex items-center h-[32px] text-[16px] font-normal text-blue-text px-4 rounded bg-blue-background border border-blue-activeCoupon"
                    >
                        See all
                        <span className="pl-2">
                            <FaArrowRight />
                        </span>
                    </Button>
                )}
            </div>
            {(rewards?.length === 0 && !loading) ||
                (error && <NoRewardsState />)}
            {loading ? (
                <EarnAndBurnLoading />
            ) : (
                <ScrollContainer
                    component={'div'}
                    className="scroll-container flex ml-2 w-full"
                    buttons={[1, 2, 3, 4]}
                >
                    {rewards?.slice(0, 4)?.map(({ reward }) => (
                        <div
                            key={reward.id}
                            className="shadow-md min-h-[60px] min-w-[70%] rounded-xl my-4 mx-2 bg-white text-blue-text p-2"
                        >
                            <h3 className="font-extrabold">
                                {reward?.name || reward?.id}
                            </h3>
                        </div>
                    ))}
                </ScrollContainer>
            )}
        </>
    )
}

const NoRewardsState = () => (
    <div className="py-3 flex justify-center items-center">
        <p className="text-[14px] font-bold text-blue-text">
            No active burn rewards
        </p>
    </div>
)

const EarnAndBurnLoading = () => (
    <div className="w-full flex justify-center items-center bg-inherit m-2">
        <PulseLoader size={5} color="#173c9f" />
    </div>
)
export default EarnAndBurnRewardsCarousel

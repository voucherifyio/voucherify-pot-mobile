import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useContext, useEffect, useState } from 'react'
import { MobileAppContext } from '../app-context/app-context'
import Loading from '../loading/loading'
import {
    CustomerObject,
    LoyaltiesListMemberRewardsResponseBody,
    RewardsAssignmentCampaignOrMaterialReward,
} from '@voucherify/sdk'
import Button from '../ui/atoms/button'
import { PulseLoader } from 'react-spinners'
import Toast from '../ui/atoms/toast'

const toastStyles =
    'font-bold border border-gray-300 rounded-lg shadow-lg fixed top-[15%] left-[50%] -translate-x-2/4 flex items-center justify-center w-full max-w-xs p-4 bg-white z-50'

const EarnAndBurnRewards = () => {
    const [rewards, setRewards] = useState<
        LoyaltiesListMemberRewardsResponseBody['data'] | []
    >([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | undefined>(undefined)
    const {
        customer,
        redeemCustomerReward,
        setDealsAndRewards,
        dealsAndRewards,
        rewardSuccessMessage,
        loyaltyPoints,
    } = useContext(MobileAppContext)
    const [isVoucherGenerationProcess, setIsVoucherGenerationProcess] =
        useState(false)

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

    const handleRedeemReward = async (
        customer: CustomerObject | undefined,
        rewardId: string,
        campaignName: string
    ) => {
        setIsVoucherGenerationProcess(true)
        const { status } = await redeemCustomerReward(
            customer,
            rewardId,
            campaignName
        )
        if (customer?.id && status === 'success') {
            setIsVoucherGenerationProcess(false)
            setDealsAndRewards({
                ...dealsAndRewards,
                rewards: dealsAndRewards.rewards + 1,
            })
        }
    }

    useEffect(() => {
        if (customer?.id) {
            listMemberRewards(customer?.id)
        }
    }, [customer?.id, isVoucherGenerationProcess, loyaltyPoints])

    if (loading) return <Loading />

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
                <p className="mb-4 text-[14px] font-bold text-blue-text">
                    You don't have any rewards.
                </p>
            </div>
        )

    return (
        <div>
            {rewardSuccessMessage && (
                <Toast
                    toastType="success"
                    toastText={rewardSuccessMessage}
                    customStyles={toastStyles}
                />
            )}
            {rewards?.map(({ reward, assignment }) => (
                <div
                    key={reward.id}
                    className="flex-1 flex-col justify-end shadow-md rounded-xl m-2 flex bg-white text-blue-text py-2 px-4 gap-2"
                >
                    <h3 className="text-[16px] font-bold">
                        Price -{' '}
                        {
                            (
                                assignment as RewardsAssignmentCampaignOrMaterialReward
                            ).parameters.loyalty.points
                        }{' '}
                        points
                    </h3>
                    <div className="flex justify-between items-end w-full">
                        <h3 className="text-[18px] font-extrabold">
                            {reward.name || reward.id}
                        </h3>
                        <Button
                            buttonType="green"
                            className="px-2 max-h-[32px] max-w-[149px] text-[16px]"
                            disabled={isVoucherGenerationProcess}
                            onClick={() => {
                                handleRedeemReward(
                                    customer,
                                    reward.id,
                                    CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN
                                )
                            }}
                        >
                            {isVoucherGenerationProcess ? (
                                <PulseLoader size={5} color="#173c9f" />
                            ) : (
                                'Choose reward'
                            )}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EarnAndBurnRewards

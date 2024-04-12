import { LoyaltiesListMemberRewardsResponseBody } from '@voucherify/sdk'
import { Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import Button from '@/app/components/ui/atoms/button'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import {
    getQualifications,
    redeemReward,
} from '@/app/apiEndpoints/apiEndpoints'
import { MobileAppContext } from '../app-context/app-context'
import { CAMPAIGNS } from '@/enum/campaigns'

type RewardsModalProps = {
    rewards: LoyaltiesListMemberRewardsResponseBody['data']
    rewardModalOpened: boolean
    setRewardModalOpened: Dispatch<SetStateAction<boolean>>
    customerId: string | null | undefined
    loading: boolean
    setRewardGeneratedMessage: Dispatch<SetStateAction<string | undefined>>
    setIsRewardButtonVisible: Dispatch<SetStateAction<boolean>>
}

type ChoiceConfirmationProps = {
    redeemCustomerReward: (
        customerId: string,
        rewardId: string,
        campaignName: string
    ) => void
    customerId: string
    rewardId: string
    confirmation: boolean
    setConfirmation: Dispatch<SetStateAction<boolean>>
    isVoucherGenerationProcess: boolean
}

const RewardsModal: FC<RewardsModalProps> = ({
    rewards,
    rewardModalOpened,
    setRewardModalOpened,
    customerId,
    loading,
    setRewardGeneratedMessage,
    setIsRewardButtonVisible,
}) => {
    const [confirmation, setConfirmation] = useState<boolean>(false)
    const [rewardId, setRewardId] = useState<string | null>(null)
    const [isVoucherGenerationProcess, setIsVoucherGenerationProcess] =
        useState(false)
    const { dealsAndRewards, setDealsAndRewards } = useContext(MobileAppContext)

    const fetchQualifications = async (
        voucherCode: string,
        interval: NodeJS.Timeout
    ) => {
        const res = await getQualifications(
            customerId,
            QUALIFICATION_SCENARIO.AUDIENCE_ONLY
        )
        const data = await res.json()
        const qualifications = data.qualifications
        for (const qualification of qualifications) {
            if (qualification.id === voucherCode) {
                clearInterval(interval)
                setConfirmation(false)
                setDealsAndRewards({
                    ...dealsAndRewards,
                    rewards: dealsAndRewards.rewards + 1,
                })
                setRewardModalOpened(false)
                setIsVoucherGenerationProcess(false)
                setRewardGeneratedMessage('Reward voucher has been generated')
                setIsRewardButtonVisible(false)
            }
        }
    }

    const redeemCustomerReward = async (
        customerId: string,
        rewardId: string,
        campaignName: string
    ) => {
        setIsVoucherGenerationProcess(true)
        const res = await redeemReward(customerId, rewardId, campaignName)
        const { redeemedReward } = await res.json()
        if (res.status !== 200) {
            console.error('Cannot redeem reward')
        }

        if (redeemedReward.reward.voucher.code) {
            const interval: NodeJS.Timeout = setInterval(
                async () =>
                    await fetchQualifications(
                        redeemedReward.reward.voucher.code,
                        interval
                    ),
                2000
            )
        }
    }

    const pattern = /\(150\s*Point[s]*\s*Reward\)/

    if (!rewardModalOpened) return null

    return (
        <div className="flex w-full min-h-80 flex-col items-end bg-[#173C9F] absolute z-50 rounded-lg px-4 py-4 gap-4 bottom-0 left-2/4 -translate-x-2/4">
            {loading && <ModalLoading message="Loading..." />}
            {!loading && rewards?.length <= 0 && (
                <NoRewardsState setRewardModalOpened={setRewardModalOpened} />
            )}
            {rewardId && customerId && confirmation && (
                <ChoiceConfimartion
                    customerId={customerId}
                    rewardId={rewardId}
                    redeemCustomerReward={redeemCustomerReward}
                    confirmation={confirmation}
                    setConfirmation={setConfirmation}
                    isVoucherGenerationProcess={isVoucherGenerationProcess}
                />
            )}
            {!loading && !confirmation && rewards?.length >= 1 && (
                <>
                    <div className="flex w-full justify-between">
                        <p className="text-white">Choose your reward</p>
                        <Button
                            buttonType="gray"
                            onClick={() => setRewardModalOpened(false)}
                            className="h-auto text-white py-1 px-2"
                        >
                            Close
                        </Button>
                    </div>
                    <div className="flex gap-3 w-full justify-center">
                        {rewards.map(({ reward }) => (
                            <Button
                                buttonType="green"
                                key={reward.id}
                                className="h-auto text-white text-center text-sm rounded-lg py-0.5 px-1"
                                onClick={() => {
                                    setRewardId(reward.id)
                                    setConfirmation(true)
                                }}
                            >
                                {reward.name?.replace(pattern, '')}
                            </Button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

const ChoiceConfimartion: FC<ChoiceConfirmationProps> = ({
    redeemCustomerReward,
    customerId,
    rewardId,
    confirmation,
    setConfirmation,
    isVoucherGenerationProcess,
}) => {
    if (isVoucherGenerationProcess) {
        return <ModalLoading message="Voucher generation process..." />
    }

    if (!confirmation) return null

    return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <p className="text-white">Are you sure?</p>
            <div className="flex w-full justify-evenly">
                <Button
                    buttonType="green"
                    onClick={() =>
                        redeemCustomerReward(
                            customerId,
                            rewardId,
                            CAMPAIGNS.MILESTONE_REWARDS_PROGRAM
                        )
                    }
                    className="text-white rounded-lg px-2 h-8"
                >
                    Choose reward
                </Button>
                <Button
                    buttonType="gray"
                    onClick={() => setConfirmation(false)}
                    className="text-white rounded-lg px-2 h-8"
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}

const ModalLoading = ({ message }: { message: string }) => (
    <div className="flex justify-center items-center w-full h-full">
        <p className="text-white">{message}</p>
    </div>
)

const NoRewardsState = ({
    setRewardModalOpened,
}: {
    setRewardModalOpened: Dispatch<SetStateAction<boolean>>
}) => (
    <div className="flex flex-col justify-center items-center w-full h-full gap-3">
        <Button
            onClick={() => setRewardModalOpened(false)}
            className="h-auto text-white self-end"
        >
            Close
        </Button>
        <p className="text-white">You don't have any rewards.</p>
    </div>
)

export default RewardsModal

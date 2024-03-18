import { LoyaltiesListMemberRewardsResponseBody } from '@voucherify/sdk'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import Button from '../ui/atoms/button'

type RewardsModalProps = {
    rewards: LoyaltiesListMemberRewardsResponseBody['data']
    rewardModalOpened: boolean
    setRewardModalOpened: Dispatch<SetStateAction<boolean>>
    customerId: string | null | undefined
}

type ChoiceConfirmationProps = {
    redeemReward: (customerId: string, rewardId: string) => void
    customerId: string
    rewardId: string
    confirmation: boolean
    setConfimration: Dispatch<SetStateAction<boolean>>
}

const RewardsModal: FC<RewardsModalProps> = ({
    rewards,
    rewardModalOpened,
    setRewardModalOpened,
    customerId,
}) => {
    const [confirmation, setConfimration] = useState<boolean>(false)
    const [rewardId, setRewardId] = useState<string | null>(null)

    const redeemReward = async (customerId: string, rewardId: string) => {
        const res = await fetch(`/api/voucherify/redeem-reward`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerId,
                rewardId,
            }),
        })

        const data = await res.json()
        if (res.status !== 200) {
            console.log(data)
        }
        setConfimration(false)
    }

    const pattern = /\(150\s*Point[s]*\s*Reward\)/

    if (!rewardModalOpened) return null

    return (
        <div className="flex w-full min-h-80 flex-col items-end bg-[#173C9F] absolute z-50 rounded-lg px-6 py-4 gap-4 bottom-0 left-2/4 -translate-x-2/4">
            {rewardId && customerId && confirmation ? (
                <ChoiceConfimartion
                    customerId={customerId}
                    rewardId={rewardId}
                    redeemReward={redeemReward}
                    confirmation={confirmation}
                    setConfimration={setConfimration}
                />
            ) : (
                <>
                    <div className="flex w-full justify-between">
                        <p className="text-white">Choose your reward</p>
                        <Button
                            onClick={() => setRewardModalOpened(false)}
                            className="h-auto text-white"
                        >
                            Close
                        </Button>
                    </div>
                    <div className="flex gap-4">
                        {rewards.map(({ reward }) => (
                            <p
                                key={reward.id}
                                className="text-white text-center text-sm bg-[#fbbc05] rounded-lg py-0.5 px-1"
                                onClick={() => {
                                    setRewardId(reward.id)
                                    setConfimration(true)
                                }}
                            >
                                {reward.name?.replace(pattern, '')}
                            </p>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

const ChoiceConfimartion: FC<ChoiceConfirmationProps> = ({
    redeemReward,
    customerId,
    rewardId,
    confirmation,
    setConfimration,
}) => {
    if (!confirmation) return null

    return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-6">
            <p className="text-white">Are you sure?</p>
            <div className="flex w-full justify-evenly">
                <button
                    onClick={() => redeemReward(customerId, rewardId)}
                    className="text-white bg-[#fbbc05] rounded-lg px-2 py-1"
                >
                    Choose reward
                </button>
                <button
                    onClick={() => setConfimration(false)}
                    className="text-white bg-[#fbbc05] rounded-lg px-2 py-1"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default RewardsModal
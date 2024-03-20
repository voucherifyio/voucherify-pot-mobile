'use client'
import { FC } from 'react'
import Button from '@/app/components/ui/atoms/button'
import { useActiveRewards } from '@/app/hooks/useActiveRewards'
import Loading from '@/app/components/loading/loading'

type RewardsProps = {
    customerId: string | undefined | null
}

export interface Reward {
    name?: string
    id: string
    object: 'campaign' | 'voucher'
    created_at: string
    campaign_name?: string
    campaign_id?: string
    result?: {}
    applicable_to?: {}
    inapplicable_to?: {}
    active: boolean
    metadata: { Reward?: number }
}

const Rewards: FC<RewardsProps> = ({ customerId }) => {
    const { activeRewards, setActiveRewards, loading } = useActiveRewards({
        customerId,
    })

    const handleActivateCoupon = async (id: string) => {
        const activeDealsAndRewards = JSON.parse(
            localStorage.getItem('activeDealsAndRewards') || '[]'
        )

        const updatedActiveDealsAndRewards = activeDealsAndRewards.includes(id)
            ? [...activeDealsAndRewards.filter((item: string) => item !== id)]
            : [...activeDealsAndRewards, id]

        localStorage.setItem(
            'activeDealsAndRewards',
            JSON.stringify(updatedActiveDealsAndRewards)
        )

        const updatedRewards = activeRewards.map((reward: Reward) => {
            if (updatedActiveDealsAndRewards.includes(reward.id)) {
                return { ...reward, active: true }
            }
            return { ...reward, active: false }
        })

        setActiveRewards(updatedRewards)
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="flex-1 flex flex-col">
            {activeRewards?.length > 0 ? (
                activeRewards.map((reward) => (
                    <div
                        key={reward.id}
                        className="shad-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {reward.name || reward.id}
                            </h3>
                            {reward.object === 'voucher' && (
                                <Button
                                    onClick={() =>
                                        handleActivateCoupon(reward.id)
                                    }
                                    buttonType={
                                        reward.active
                                            ? 'activeCoupon'
                                            : 'yellow'
                                    }
                                    className="mt-4 px-2 max-h-[32px] max-w-[149px] text-[16px]"
                                >
                                    {reward.active
                                        ? '✓ Active coupon'
                                        : 'Activate coupon'}
                                </Button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex-1 w-full h-full flex justify-center items-center">
                    <p className="mb-4 text-[14px] font-bold text-blue-text">
                        You don't have any rewards.
                    </p>
                </div>
            )}
        </div>
    )
}

export default Rewards

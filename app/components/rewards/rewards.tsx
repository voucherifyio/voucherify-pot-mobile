'use client'

import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { FC, useEffect, useState } from 'react'
import Button from '../ui/atoms/button'

type RewardsProps = {
    customerId: string | undefined | null
}

export interface Rewards {
    id: string
    name?: string
    object: 'campaign' | 'voucher'
    created_at: string
    result?: {
        loyalty_card?: {
            points?: number
        }
    }
    campaign_name: string
    campaign_id: string
    applicable_to?: {}
    inapplicable_to?: {}
    active: boolean
    available: boolean
    metadata: { Reward?: number }
}

const Rewards: FC<RewardsProps> = ({ customerId }) => {
    const [rewards, setRewards] = useState<Rewards[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`api/voucherify/qualifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    scenario: QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                }),
            })

            const data = await res.json()
            const allRewards: Rewards[] = data.qualifications.redeemables.data
            const filteredRewards = allRewards.filter(
                (reward) => reward.metadata.Reward
            )
            setRewards(filteredRewards)
        }

        fetchData()
    }, [])

    return (
        <div className="flex-1 flex flex-col">
            {rewards?.length > 0 ? (
                rewards.map((reward) => (
                    <div
                        key={reward.id}
                        className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {reward?.name || reward.id}
                            </h3>
                            {/* {reward.object === 'voucher' && (
                                <Button
                                    // onClick={() =>
                                    //     handleActivateCoupon(
                                    //         deal.id,
                                    //         deal.active,
                                    //         deal.available
                                    //     )
                                    // }
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
                            )} */}
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex-1 w-full h-full flex justify-center items-center">
                    <p className="font-medium">You don't have any rewards.</p>
                </div>
            )}
        </div>
    )
}

export default Rewards

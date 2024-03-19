import { useEffect, useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { Reward } from '@/app/components/rewards/rewards'

export const useActiveRewards = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [activeRewards, setActiveRewards] = useState<Reward[]>([])

    useEffect(() => {
        if (customerId) {
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
                const qualifications: Reward[] =
                    data.qualifications.redeemables.data
                const filteredRewards = qualifications.filter(
                    (reward: Reward) => reward.metadata.Reward
                )

                localStorage.setItem(
                    'dealsAndRewards',
                    JSON.stringify(qualifications)
                )

                const activeDealsAndRewards = JSON.parse(
                    localStorage.getItem('activeDealsAndRewards') || '[]'
                )

                const updatedRewards = filteredRewards.map((reward: Reward) => {
                    if (activeDealsAndRewards.includes(reward.id)) {
                        return { ...reward, active: true }
                    }
                    return { ...reward, active: false }
                })

                setActiveRewards(updatedRewards)
            }

            fetchData()
        }
    }, [customerId])

    return { activeRewards, setActiveRewards }
}

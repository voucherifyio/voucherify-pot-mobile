import { useContext, useEffect, useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { Reward } from '@/app/components/rewards/rewards'
import { getQualifications } from '../apiEndpoints/apiEndpoints'
import { MobileAppContext } from '../components/app-context/app-context'

export const useActiveRewards = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const { setDealsAndRewards, dealsAndRewards } = useContext(MobileAppContext)
    const [activeRewards, setActiveRewards] = useState<Reward[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (customerId) {
            const fetchData = async () => {
                const res = await getQualifications(
                    customerId,
                    QUALIFICATION_SCENARIO.AUDIENCE_ONLY
                )
                const data = await res.json()
                const qualifications: Reward[] = data.qualifications
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
                setDealsAndRewards({
                    ...dealsAndRewards,
                    rewards: updatedRewards.length,
                })
                setLoading(false)
            }

            fetchData()
        }
    }, [customerId])

    return { activeRewards, setActiveRewards, loading }
}

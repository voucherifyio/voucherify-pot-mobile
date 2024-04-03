import { useEffect, useState } from 'react'
import { DealsAndRewards } from '../components/app-context/app-context'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { Reward } from '../components/rewards/rewards'
import { Deal } from '../components/deals/deals'
import { getQualifications } from '../apiEndpoints/apiEndpoints'

export const useLocalStorage = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [dealsAndRewards, setDealsAndRewards] = useState<DealsAndRewards>({
        rewards: 0,
        deals: 0,
    })

    useEffect(() => {
        if (customerId) {
            const handleStorage = async (customerId: string) => {
                const res = await getQualifications(
                    customerId,
                    QUALIFICATION_SCENARIO.AUDIENCE_ONLY
                )
                const data = await res.json()
                const qualifications: Reward[] = data.qualifications
                const filteredRewards =
                    qualifications?.filter(
                        (reward: Reward) => reward.metadata.Reward
                    ) || []
                const filteredDeals =
                    qualifications?.filter(
                        (deal: Deal) => !deal.metadata.hasOwnProperty('Reward')
                    ) || []
                setDealsAndRewards({
                    rewards: filteredRewards.length,
                    deals: filteredDeals.length,
                })
            }

            handleStorage(customerId)
        }
    }, [customerId])

    return {
        dealsAndRewards,
        setDealsAndRewards,
    }
}

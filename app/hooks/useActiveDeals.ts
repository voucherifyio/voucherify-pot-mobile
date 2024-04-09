import { useEffect, useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { Deal } from '@/app/components/deals/deals'
import { getQualifications } from '../apiEndpoints/apiEndpoints'

export const useActiveDeals = ({
    customerSourceId,
}: {
    customerSourceId: string | null | undefined
}) => {
    const [activeDeals, setActiveDeals] = useState<Deal[]>([])
    const [error, setError] = useState<string | undefined>(undefined)
    const [dealsLoading, setDealsLoading] = useState(true)

    useEffect(() => {
        if (customerSourceId) {
            const fetchData = async () => {
                try {
                    const res = await getQualifications(
                        customerSourceId,
                        QUALIFICATION_SCENARIO.AUDIENCE_ONLY
                    )
                    const data = await res.json()
                    const qualifications: Deal[] = data.qualifications
                    const filteredDeals = qualifications.filter(
                        (deal: Deal) => !deal.metadata.hasOwnProperty('Reward')
                    )

                    localStorage.setItem(
                        'dealsAndRewards',
                        JSON.stringify(qualifications)
                    )

                    const activeDealsAndRewards = JSON.parse(
                        localStorage.getItem('activeDealsAndRewards') || '[]'
                    )

                    const updatedDeals = filteredDeals.map((deal: Deal) => {
                        if (activeDealsAndRewards.includes(deal.id)) {
                            return { ...deal, active: true }
                        }
                        return { ...deal, active: false }
                    })
                    setActiveDeals(updatedDeals)
                    setDealsLoading(false)
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    return err
                }
                setDealsLoading(false)
            }
            fetchData()
        }
    }, [customerSourceId])

    return { activeDeals, setActiveDeals, error, dealsLoading }
}

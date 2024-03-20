import { useEffect, useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { Deal } from '@/app/components/deals/deals'

export const useActiveDeals = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [activeDeals, setActiveDeals] = useState<Deal[]>([])
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (customerId) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`/api/voucherify/qualifications`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            customerId,
                            scenario: QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                        }),
                    })
                    const data = await res.json()
                    const qualifications: Deal[] =
                        data.qualifications.redeemables.data
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
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    return err
                }
                setLoading(false)
            }
            fetchData()
        }
    }, [customerId])

    return { activeDeals, setActiveDeals, error, loading }
}

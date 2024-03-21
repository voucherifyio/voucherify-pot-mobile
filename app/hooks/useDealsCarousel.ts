import { useEffect, useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { getQualifications } from '../apiEndpoints/apiEndpoints'

interface Deal {
    id: string
    name?: string
    object: 'campaign' | 'voucher'
    created_at: string
    result?: {
        loyalty_card?: {
            points?: number
        }
    }
    applicable_to?: {}
    inapplicable_to?: {}
    active: boolean
    metadata: {}
    available: boolean
}

const filterDealVouchers = (dealsAndRewards: Deal[]) => {
    return dealsAndRewards.filter(
        (item: Deal) => !item.metadata.hasOwnProperty('Reward')
    )
}

export const useDealsCarousel = ({
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
                const dealsAndRewards = JSON.parse(
                    localStorage.getItem('dealsAndRewards') || '[]'
                )
                let filteredDeals = filterDealVouchers(dealsAndRewards)
                if (filteredDeals.length > 0) {
                    setActiveDeals(filteredDeals)
                } else {
                    try {
                        const res = await getQualifications(
                            customerId,
                            QUALIFICATION_SCENARIO.AUDIENCE_ONLY
                        )
                        const data = await res.json()
                        filteredDeals = filterDealVouchers(data.qualifications)
                        setActiveDeals(filteredDeals)
                    } catch (err) {
                        if (err instanceof Error) {
                            return setError(err.message)
                        }
                        return err
                    }
                }
                setLoading(false)
            }
            fetchData()
        }
    }, [customerId])

    return { activeDeals, error, loading }
}

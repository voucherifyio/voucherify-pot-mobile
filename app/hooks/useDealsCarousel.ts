import { useEffect, useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'

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
                        const res = await fetch(
                            `/api/voucherify/qualifications`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    customerId,
                                    scenario:
                                        QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                                }),
                            }
                        )
                        const data = await res.json()
                        filteredDeals = filterDealVouchers(
                            data.qualifications.redeemables.data
                        )
                        setActiveDeals(filteredDeals)
                    } catch (err) {
                        if (err instanceof Error) {
                            return setError(err.message)
                        }
                        return err
                    }
                }
            }
            fetchData()
        }
    }, [customerId])

    return { activeDeals, error }
}

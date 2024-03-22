import { useEffect, useState } from 'react'
import { Deal } from '@/app/components/deals/deals'
import { getBarcode } from '../apiEndpoints/apiEndpoints'

interface ActivatedReward {
    active: boolean
    applicable_to: {}
    campaign_id: string
    campaign_name: string
    created_at: string
    id: string
    inapplicable_to: {}
    metadata: {}
    object: string
    barcode?: {
        url?: string
        id?: string
    }
    result: {}
}

export const useActivatedDealsAndRewards = () => {
    const [activatedRewards, setActivatedRewards] = useState<ActivatedReward[]>(
        []
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const dealsAndRewards = JSON.parse(
                localStorage.getItem('dealsAndRewards') || '[]'
            )

            const activeDealsAndRewards = JSON.parse(
                localStorage.getItem('activeDealsAndRewards') || '[]'
            )

            const activatedDealsAndRewards = dealsAndRewards
                .map((item: Deal) => {
                    if (activeDealsAndRewards.includes(item.id)) {
                        return { ...item, active: true }
                    }
                })
                .filter((item: Deal) => !!item)

            const retrievedBarcode = async (item: Deal) => {
                const res = await getBarcode(item)
                const data = await res.json()
                return {
                    ...item,
                    barcode: data.barcode,
                }
            }

            const barcodePromises =
                activatedDealsAndRewards.map(retrievedBarcode)
            const updatedDeals = await Promise.all(barcodePromises)
            setActivatedRewards(updatedDeals)
            setLoading(false)
        }

        fetchData().catch(console.error)
    }, [])

    return { activatedRewards, loading }
}

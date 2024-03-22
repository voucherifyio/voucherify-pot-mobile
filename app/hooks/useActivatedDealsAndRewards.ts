import { useEffect, useState } from 'react'
import { Deal } from '@/app/components/deals/deals'
import { getBarcode } from '../apiEndpoints/apiEndpoints'

interface ActivatedReward {
    id: string
    barcode?: {
        url?: string
        id?: string
    }
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

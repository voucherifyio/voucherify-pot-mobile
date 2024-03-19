import { useEffect, useState } from 'react'
import { Deal } from '@/app/components/deals/deals'

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

            const fetchBarcode = async (item: Deal) => {
                const barcodesRes = await fetch(
                    `/api/voucherify/voucher-barcode?coupon=${item.id}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
                const data = await barcodesRes.json()
                return {
                    ...item,
                    barcode: data.barcode,
                }
            }

            const barcodePromises = activatedDealsAndRewards.map(fetchBarcode)
            const updatedDeals = await Promise.all(barcodePromises)
            setActivatedRewards(updatedDeals)
        }

        fetchData().catch(console.error)
    }, [])

    return { activatedRewards }
}

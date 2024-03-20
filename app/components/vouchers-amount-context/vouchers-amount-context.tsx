'use client'
import {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from 'react'
import { useSession } from 'next-auth/react'
import { Reward } from '@/app/components/rewards/rewards'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { Deal } from '@/app/components/deals/deals'

export type DealsAndRewards = {
    rewards: number
    deals: number
}

export type VouchersAmount = {
    dealsAndRewards: DealsAndRewards
    setDealsAndRewards: Dispatch<SetStateAction<DealsAndRewards>>
}

export const VouchersAmountContext = createContext<VouchersAmount>({
    dealsAndRewards: { rewards: 0, deals: 0 },
    setDealsAndRewards: () => {},
})

const VouchersAmount = ({ children }: { children: JSX.Element }) => {
    const { data } = useSession()
    const customerId = data?.user?.id
    const [dealsAndRewards, setDealsAndRewards] = useState<DealsAndRewards>({
        rewards: 0,
        deals: 0,
    })

    useEffect(() => {
        const handleStorage = async (customerId: string | null | undefined) => {
            const res = await fetch(`api/voucherify/qualifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    scenario: QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                }),
            })

            const data = await res.json()
            const qualifications: Reward[] = data.qualifications
            const filteredRewards = qualifications.filter(
                (reward: Reward) => reward.metadata.Reward
            )
            const filteredDeals = qualifications.filter(
                (deal: Deal) => !deal.metadata.hasOwnProperty('Reward')
            )
            setDealsAndRewards({
                rewards: filteredRewards.length,
                deals: filteredDeals.length,
            })
        }
        if (customerId) {
            handleStorage(customerId)
        }
    }, [customerId])

    return (
        <VouchersAmountContext.Provider
            value={{ dealsAndRewards, setDealsAndRewards }}
        >
            {children}
        </VouchersAmountContext.Provider>
    )
}

export default VouchersAmount

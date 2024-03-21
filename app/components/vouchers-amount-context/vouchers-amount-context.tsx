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
import { getQualifications } from '@/app/apiEndpoints/apiEndpoints'

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

    return (
        <VouchersAmountContext.Provider
            value={{ dealsAndRewards, setDealsAndRewards }}
        >
            {children}
        </VouchersAmountContext.Provider>
    )
}

export default VouchersAmount

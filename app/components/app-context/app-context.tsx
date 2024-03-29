'use client'
import { useCustomer } from '@/app/hooks/useCustomer'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'
import { CustomerObject } from '@voucherify/sdk'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction, createContext, useEffect } from 'react'

export type DealsAndRewards = {
    rewards: number
    deals: number
}

type MobileAppContextType = {
    dealsAndRewards: DealsAndRewards
    setDealsAndRewards: Dispatch<SetStateAction<DealsAndRewards>>
    customer: CustomerObject | undefined
    getCurrentCustomer: () => Promise<void | true>
    isLinkedToAeroplan: boolean
}

export const MobileAppContext = createContext<MobileAppContextType>({
    dealsAndRewards: { deals: 0, rewards: 0 },
    setDealsAndRewards: () => {},
    customer: undefined,
    getCurrentCustomer: async () => true,
    isLinkedToAeroplan: false,
})

const MobileApp = ({ children }: { children: JSX.Element }) => {
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const { customer, getCurrentCustomer, isLinkedToAeroplan } = useCustomer({
        customerPhone: customerPhone,
    })
    const customerId = customer?.id
    const { dealsAndRewards, setDealsAndRewards } = useLocalStorage({
        customerId,
    })

    useEffect(() => {
        const fetchMobileAppData = async () => {
            await getCurrentCustomer()

        }

        fetchMobileAppData()
        const refetchInterval = setInterval(fetchMobileAppData, 3000)
        return () => clearInterval(refetchInterval)
    }, [customerPhone])

    return (
        <MobileAppContext.Provider
            value={{
                dealsAndRewards,
                setDealsAndRewards,
                customer,
                getCurrentCustomer,
                isLinkedToAeroplan,
            }}
        >
            {children}
        </MobileAppContext.Provider>
    )
}

export default MobileApp

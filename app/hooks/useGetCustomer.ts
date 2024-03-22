import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CustomerObject } from '@voucherify/sdk'

export const useGetCustomer = () => {
    const { data } = useSession()
    const [customer, setCustomer] = useState<CustomerObject>()
    const userPhone = data?.user?.id

    useEffect(() => {
        if (userPhone) {
            const getCustomer = async () => {
                const res = await fetch(
                    `/api/voucherify/get-customer?phone=${userPhone}`,
                    {
                        method: 'GET',
                    }
                )
                const { customer } = await res.json()
                if (res.status !== 200) {
                    return true
                }
                setCustomer(customer)
            }

            getCustomer()
            const refetchInterval = setInterval(getCustomer, 3000)
            return () => clearInterval(refetchInterval)
        }
    }, [userPhone])

    return { customer }
}

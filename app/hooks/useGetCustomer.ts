import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CustomerObject } from '@voucherify/sdk'
import { getCustomer } from '../apiEndpoints/apiEndpoints'

export const useGetCustomer = () => {
    const { data } = useSession()
    const [customer, setCustomer] = useState<CustomerObject>()
    const userPhone = data?.user?.id

    useEffect(() => {
        if (userPhone) {
            const fetchData = async () => {
                const res = await getCustomer(userPhone)
                const { customer } = await res.json()
                if (res.status !== 200) {
                    return true
                }
                setCustomer(customer)
            }

            fetchData()
        }
    }, [userPhone])

    return { customer }
}

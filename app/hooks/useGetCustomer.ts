import { CustomerObject } from '@voucherify/sdk'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useGetCustomer = () => {
    const { data } = useSession()
    const [customer, setCustomer] = useState<CustomerObject>()

    useEffect(() => {
        const userPhone = data?.user?.id
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
                console.log(customer)
                setCustomer(customer)
            }

            getCustomer()
        }
    }, [])

    return { customer }
}

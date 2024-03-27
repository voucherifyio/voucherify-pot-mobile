import { useEffect, useState } from 'react'
import { getCustomer } from '../apiEndpoints/apiEndpoints'

export const useAeroplan = ({
    customerPhone,
}: {
    customerPhone: string | null | undefined
}) => {
    const [isLinkedToAeroplan, setIsLinkedToAeroplan] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (customerPhone) {
            const fetchData = async () => {
                setLoading(true)
                try {
                    const res = await getCustomer(customerPhone)
                    const { customer } = await res.json()
                    if (customer.metadata?.aeroplan_member) {
                        setIsLinkedToAeroplan(
                            customer.metadata?.aeroplan_member
                        )
                    }
                    setLoading(false)
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    setLoading(false)
                    return err
                }
            }

            fetchData()
        }
    }, [customerPhone])

    return { isLinkedToAeroplan, loading, error }
}

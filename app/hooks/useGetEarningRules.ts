import { useEffect, useState } from 'react'
import { EarningRule } from '@/app/components/earning-rules/earning-rules'
import { CAMPAIGNS } from '@/enum/campaigns'
import { getEarningRules } from '../apiEndpoints/apiEndpoints'

export const useGetEarningRules = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [earningRules, setEarningRules] = useState<EarningRule[]>([])
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (customerId) {
            const fetchData = async () => {
                try {
                    const res = await getEarningRules(
                        CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM_ID
                    )
                    const data = await res.json()
                    const fetchedEarningRules = data.earningRules.data
                    setEarningRules(fetchedEarningRules)
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    return err
                }
                setLoading(false)
            }

            fetchData()
        }
    }, [customerId])

    return { earningRules, error, loading }
}

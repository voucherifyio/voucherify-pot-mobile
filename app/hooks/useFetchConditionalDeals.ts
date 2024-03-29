import { useEffect, useState } from 'react'
import { CAMPAIGNS } from '@/enum/campaigns'
import { SEGMENTS } from '@/enum/segments'
import { Deal } from '@/app/components/deals/deals'
import { getCampaign, listCustomerSegments } from '../apiEndpoints/apiEndpoints'

interface Segment {
    id: string
    name: string
    object: string
}

export const useConditionalDeals = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [loading, setLoading] = useState(true)
    const [
        isNotEligibleForTheConditionalDeal,
        setIsNotEligibleForTheConditionalDeal,
    ] = useState<boolean>(false)
    const [conditionalDeals, setConditionalDeals] = useState<Deal[]>([])

    useEffect(() => {
        const fetchConditionalDeals = async () => {
            if (customerId) {
                try {
                    const res = await getCampaign(
                        CAMPAIGNS.FREE_COCA_COCA_CAMPAIGN_ID
                    )
                    const data = await res.json()
                    try {
                        const res = await listCustomerSegments(customerId)
                        const { customerSegments } = await res.json()
                        if (
                            !customerSegments.data.find(
                                (segment: Segment) =>
                                    segment.name ===
                                    SEGMENTS.CUSTOMER_PURCHASED_3_PLUS_LOCALISATIONS
                            )
                        ) {
                            setIsNotEligibleForTheConditionalDeal(true)
                        } else {
                            setConditionalDeals([])
                            setLoading(false)
                            return
                        }
                    } catch (err) {
                        return err
                    }
                    setConditionalDeals([data.campaign])
                    setLoading(false)
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(err)
                    }
                    setLoading(false)
                    return err
                }
            }
        }
        fetchConditionalDeals()
    }, [])

    return {
        conditionalDeals,
        setConditionalDeals,
        isNotEligibleForTheConditionalDeal,
        setIsNotEligibleForTheConditionalDeal,
        loading,
    }
}

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
    customerSourceId,
}: {
    customerSourceId: string | null | undefined
}) => {
    const [conditionalDealsLoading, setConditionalDealsLoading] = useState(true)
    const [
        isNotEligibleForTheConditionalDeal,
        setIsNotEligibleForTheConditionalDeal,
    ] = useState<boolean>(false)
    const [conditionalDeals, setConditionalDeals] = useState<Deal[]>([])

    useEffect(() => {
        const fetchConditionalDeals = async () => {
            if (customerSourceId) {
                try {
                    const res = await getCampaign(
                        CAMPAIGNS.FREE_COCA_COCA_CAMPAIGN_ID
                    )
                    const data = await res.json()
                    try {
                        const res = await listCustomerSegments(customerSourceId)
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
                            setConditionalDealsLoading(false)
                            return
                        }
                    } catch (err) {
                        return err
                    }
                    setConditionalDeals([data.campaign])
                    setConditionalDealsLoading(false)
                } catch (err) {
                    if (err instanceof Error) {
                        console.error(err)
                    }
                    setConditionalDealsLoading(false)
                    return err
                }
            }
        }
        fetchConditionalDeals()
    }, [customerSourceId])

    return {
        conditionalDeals,
        setConditionalDeals,
        isNotEligibleForTheConditionalDeal,
        setIsNotEligibleForTheConditionalDeal,
        conditionalDealsLoading,
    }
}

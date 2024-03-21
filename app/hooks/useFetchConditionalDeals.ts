import { useEffect, useState } from 'react'
import { CAMPAIGNS } from '@/enum/campaigns'
import { SEGMENTS } from '@/enum/segments'
import { Deal } from '@/app/components/deals/deals'

interface Segment {
    id: string
    name: string
    object: string
}

export const useFetchConditionalDeals = ({
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
            // Get the campaign
            if (customerId) {
                try {
                    const res = await fetch(
                        `/api/voucherify/get-campaign?campaignId=${CAMPAIGNS.FREE_COCA_COCA_CAMPAIGN_ID}`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        }
                    )
                    const data = await res.json()

                    // Check if the customer is eligible for the discount
                    // List customer's segments and check if the customer is in the segment
                    try {
                        const res = await fetch(
                            `/api/voucherify/list-customers-segments?customerId=${customerId}`,
                            {
                                method: 'GET',
                            }
                        )
                        const data = await res.json()
                        if (
                            !data.customersSegments.data.find(
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

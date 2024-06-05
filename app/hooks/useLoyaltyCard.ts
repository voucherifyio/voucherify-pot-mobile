import { useContext, useEffect, useState } from 'react'
import { getLoyaltyCard } from '../apiEndpoints/apiEndpoints'
import { MobileAppContext } from '../components/app-context/app-context'

interface LoyaltyCardResponse {
    loyaltyCard: {
        code: string
        barcode: {
            id: string
            url: string
        }
    }
}

export const useLoyaltyCard = ({
    customerId,
}: {
    customerId: string | null | undefined
}) => {
    const [error, setError] = useState<undefined | string>(undefined)
    const [cardUrl, setCardUrl] = useState<string>('')
    const [cardNumber, setCardNumber] = useState<string>('')
    const { loyaltyCampaignName } = useContext(MobileAppContext)

    useEffect(() => {
        if (customerId && loyaltyCampaignName) {
            const fetchData = async () => {
                try {
                    const res = await getLoyaltyCard(
                        customerId,
                        loyaltyCampaignName
                    )
                    const data: LoyaltyCardResponse = await res.json()
                    setCardUrl(data.loyaltyCard.barcode.url)
                    setCardNumber(data.loyaltyCard.code)
                } catch (err) {
                    if (err instanceof Error) {
                        return setError(err.message)
                    }
                    return err
                }
            }
            fetchData()
        }
    }, [customerId, loyaltyCampaignName])

    return { cardUrl, cardNumber, error, setError }
}

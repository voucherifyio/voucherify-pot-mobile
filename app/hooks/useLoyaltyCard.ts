import { useEffect, useState } from 'react'

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

    useEffect(() => {
        if (customerId) {
            const fetchData = async () => {
                try {
                    const res = await fetch(
                        `/api/voucherify/loyalty-card?customerId=${customerId}`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        }
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
    }, [customerId])

    return { cardUrl, cardNumber, error, setError }
}

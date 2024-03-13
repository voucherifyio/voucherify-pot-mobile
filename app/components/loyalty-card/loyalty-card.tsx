import { useEffect, useState } from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import MilestoneChart from '@/app/components/milestones/milestone-chart'

interface LoyaltyCardProps {
    customerId: string
}

interface LoyaltyCardResponse {
    loyaltyCard: {
        code: string
        barcode: {
            id: string
            url: string
        }
    }
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ customerId }) => {
    const [error, setError] = useState<undefined | string>(undefined)
    const [cardUrl, setCardUrl] = useState<string>('')
    const [cardNumber, setCardNumber] = useState<string>('')
    const [codeCopied, setCodeCopied] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            // const customerId = session?.user?.id
            if (customerId) {
                try {
                    const res = await fetch(
                        `/api/loyalty-card?customerId=${customerId}`,
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
        }
        if (!cardUrl || !cardNumber) {
            fetchData().catch(console.error)
        }
    }, [])

    const handleCopy = async () => {
        try {
            setCodeCopied(false)
            await navigator.clipboard.writeText(cardNumber)
            setCodeCopied(true)
            setTimeout(() => {
                setCodeCopied(false)
            }, 2000)
        } catch (err) {
            console.error('Unable to copy code')
            setCodeCopied(false)
            setError(error)
        }
    }

    return (
        <>
            {cardUrl && (
                <Image
                    src={cardUrl}
                    alt="loyaltyCardBarCode"
                    width={390}
                    height={106}
                    className="max-w-auto"
                />
            )}
            <Button
                onClick={handleCopy}
                className="w-full my-4 bg-blue-background border border-blue-inputOutlineDefault"
            >
                {codeCopied ? 'Code copied!' : 'Copy number'}
            </Button>
            {error && (
                <p className="text-red-500 font-extrabold">Error: {error}</p>
            )}
        </>
    )
}

export default LoyaltyCard

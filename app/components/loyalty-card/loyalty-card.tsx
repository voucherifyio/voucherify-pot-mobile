import { useState } from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useLoyaltyCard } from '@/app/hooks/useLoyaltyCard'

interface LoyaltyCardProps {
    customerId: string
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ customerId }) => {
    const { cardNumber, cardUrl, error, setError } = useLoyaltyCard({
        customerId,
    })
    const [codeCopied, setCodeCopied] = useState<boolean>(false)

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
            {cardUrl && !error && (
                <Image
                    src={cardUrl}
                    alt="loyaltyCardBarCode"
                    width={390}
                    height={106}
                    className="max-w-auto"
                />
            )}
            {cardNumber && !error && (
                <Button
                    onClick={handleCopy}
                    className="w-full my-4 border border-blue-inputOutlineDefault"
                >
                    {codeCopied ? 'Number copied!' : 'Copy number'}
                </Button>
            )}
            {error && (
                <p className="text-red-500 font-extrabold">Error: {error}</p>
            )}
        </>
    )
}

export default LoyaltyCard

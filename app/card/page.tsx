'use client'
import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import ActiveRewards from '@/app/components/active-rewards'
import JournieHeader from '@/app/components/journie-header/journie-header'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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

export default function CardPage() {
    //todo show error
    const [error, setError] = useState<undefined | string>(undefined)
    const [cardUrl, setCardUrl] = useState<string>('')
    const [cardNumber, setCardNumber] = useState<string>('')
    const [codeCopied, setCodeCopied] = useState<boolean>(false)
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'loading') {
            return
        }
        if (!session || status !== 'authenticated') {
            router.push('/')
        }
        const fetchData = async () => {
            const customerId = session?.user?.id
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
    }, [status, router, session])

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
        }
    }
    return (
        <>
            {status === 'authenticated' && (
                <div className="h-screen items-center justify-center">
                    <JournieHeader headerText={'My JOURNIE Card'} />
                    <div className="flex-row p-4 h-[100%] w-full bg-blue-background">
                        <header>
                            <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                                Scan in-store
                            </h1>
                            <h4 className="text-16 font-normal text-blue-text mb-4">
                                Show this card when you pay in-store to earn
                                points and redeem rewards.
                            </h4>
                        </header>
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
                        <ActiveRewards />
                    </div>
                </div>
            )}
        </>
    )
}

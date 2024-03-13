'use client'
import Image from 'next/image'
import loyaltyCardBarCode from '@/public/images/loyalty-card.png'
import Button from '@/app/components/ui/atoms/button'
import ActiveRewards from '@/app/components/active-rewards'
import JournieHeader from '@/app/components/journie-header/journie-header'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function CardPage() {
    //todo change this to real card number
    const [cardNumber, setCardNumber] = useState<string>('123')
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
    }, [session, status, router])

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
                    {/*header*/}
                    <JournieHeader headerText={'My JOURNIE Card'} />
                    <div className="flex-row p-4 h-[100%] w-full bg-blue-background">
                        {/*	Card*/}
                        <header>
                            <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                                Scan in-store
                            </h1>
                            <h4 className="text-16 font-normal text-blue-text mb-4">
                                Show this card when you pay in-store to earn
                                points and redeem rewards.
                            </h4>
                        </header>
                        {/*todo change this to real loyalty card bar code fetched from V%*/}
                        <Image
                            src={loyaltyCardBarCode}
                            alt="loyaltyCardBarCode"
                            width={390}
                            height={106}
                            className="max-w-auto"
                        />
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

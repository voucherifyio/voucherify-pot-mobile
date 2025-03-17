'use client'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { CAMPAIGNS } from '@/enum/campaigns'
import { MobileAppContext } from '../app-context/app-context'
import ScrollContainer from 'react-indiana-drag-scroll'
import Image from 'next/image'

const LOYALTY_HARDCODED_RESOURCES = [
    {
        title: 'FAQs',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: '/images/volkswagen/loyalty-resource1.png'
    },
    {
        title: 'Unlocking',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: '/images/volkswagen/loyalty-resource2.png'
    },
    {
        title: 'Subscribe',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: '/images/volkswagen/home-image.png'
    }
]

interface EarningRulesProps {
    customerId: string
}

export interface EarningRule {
    id: string
    loyalty: {
        points: number;
        type: string
    },
    metadata?: {
        description: string;
    },
    source?: {
        banner?: string
    }
}

const EarningRules: React.FC<EarningRulesProps> = () => {
    const [earningRules, setEarningRules] = useState<EarningRule[]>([])
    const [error, setError] = useState<string | undefined>(undefined)
    const { loyaltyCampaignName } = useContext(MobileAppContext)

    useEffect(() => {
        const fetchEarningRules = async () => {
            try {
                const campaignId =
                    loyaltyCampaignName === CAMPAIGNS.LOYALTY_PROGRAM
                        ? CAMPAIGNS.LOYALTY_PROGRAM_ID
                        : CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN_ID
                const res = await fetch(
                    `/api/voucherify/list-earning-rules?campaignId=${campaignId}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
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
        }
        if (!earningRules || earningRules.length === 0) {
            fetchEarningRules().catch(console.error)
        }
    }, [loyaltyCampaignName])

    return (
        <>
            {error && <Toast toastText={error} toastType="error" />}
            <div className="pt-2">
                {earningRules.map((rule, index) => (
                    <div
                        key={rule.id}
                        className="rounded-xl m-2 flex bg-white p-2 border border-gray-200"
                    >
                        <div className="flex flex-col p-2 gap-2">
                            {index === 1 ? (
                                <span className='text-sm bg-cyan-400 rounded-xl px-2 font-extrabold self-start'>Great Deal</span>
                                ) : null}
                            <h3 className="text-[20px] font-extrabold">
                                {rule?.source?.banner || rule.id}
                            </h3>
                            {rule.loyalty.points ? <p className='font-extrabold'>{rule.loyalty.points} points </p> : null}
                            <p className='text-xs'>{rule.metadata?.description}</p>
                        </div>
                    </div>
                ))}
                <p className='px-2 my-4 font-bold text-xl' >For you</p>
                <ScrollContainer className='scroll-container flex w-full px-2 mb-4 gap-4' component={'div'}>
                    {LOYALTY_HARDCODED_RESOURCES.map(resource => (
                        <div className='min-w-[70%]'>
                            <div className='relative w-full h-[150px]'>
                                <Image src={resource.image} alt='' fill objectFit='cover' className='rounded-t-[8px]' />
                            </div>
                            <div className='flex flex-col gap-2 bg-white p-4 rounded-b-[8px]'>
                                <p className='font-bold'>{resource.title}</p>
                                <p className='text-xs text-gray-400'>{resource.description}</p>
                            </div>
                        </div>
                    ))}
                </ScrollContainer>
            </div>
        </>
    )
}

export default EarningRules

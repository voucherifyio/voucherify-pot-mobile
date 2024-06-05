'use client'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { CAMPAIGNS } from '@/enum/campaigns'
import { MobileAppContext } from '../app-context/app-context'

interface EarningRulesProps {
    customerId: string
}

export interface EarningRule {
    id: string
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
                {earningRules.map((rule) => (
                    <div
                        key={rule.id}
                        className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {rule?.source?.banner || rule.id}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default EarningRules

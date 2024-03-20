'use client'
import { useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
interface EarningRulesProps {
    customerId: string
}

interface EarningRule {
    id: string
    name: string
}

const EarningRules: React.FC<EarningRulesProps> = ({ customerId }) => {
    // const [earningRules, setEarningRules] = useState<EarningRule[]>([])
    const [error, setError] = useState<string | undefined>(undefined)

    const earningRules = [
        {
            id: 1,
            name: 'Buy chocolate bar get 2x points',
        },
    ]
    return (
        <div className="bg-blue-background h-[90%] pt-2">
            {error && <Toast toastText={error} toastType="error" />}
            <div className="bg-blue-background mx-auto h-auto pt-2">
                {earningRules.map((rule) => (
                    <div
                        key={rule.id}
                        className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {rule?.name || rule.id}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
            <footer className="bg-blue-background h-[40px]"></footer>
        </div>
    )
}

export default EarningRules

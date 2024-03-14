'use client'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import MilestoneChart from '@/app/components/milestones/milestone-chart'

type MilestonesProps = {
    userPhone: string | undefined | null
}

const Milestones: FC<MilestonesProps> = ({ userPhone }) => {
    const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0)

    useEffect(() => {
        if (userPhone) {
            const getCustomer = async () => {
                const res = await fetch(
                    `/api/voucherify/get-customer?phone=${userPhone}`,
                    {
                        method: 'GET',
                    }
                )
                const data = await res.json()
                if (res.status !== 200) {
                    return true
                }
                setLoyaltyPoints(data?.customer?.loyalty.points || 0)
            }

            getCustomer()
        }
    }, [])

    return (
        <div className="p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">{loyaltyPoints}</span>
                </h4>
            </header>
            <MilestoneChart points={loyaltyPoints} />
        </div>
    )
}

export default Milestones

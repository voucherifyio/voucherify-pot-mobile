'use client'

import { useState } from 'react'
import MilestoneChart from '@/app/components/milestones/milestone-chart'

const Milestones = () => {
    //set real loyalty points
    const [loyaltyPoints, setLoyaltyPoints] = useState<number>(300)
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

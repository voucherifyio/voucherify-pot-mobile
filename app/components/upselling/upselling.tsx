'use client'

import { useState } from 'react'
import Milestones from '@/app/components/upselling/milestones'

const Upselling = () => {
    //set real loyalty points
    const [loyaltyPoints, setLoyaltyPoints] = useState<number>(50)
    return (
        <div className="p-4">
            <header>
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">{loyaltyPoints}</span>
                </h4>
            </header>
            <Milestones points={loyaltyPoints} />
        </div>
    )
}

export default Upselling

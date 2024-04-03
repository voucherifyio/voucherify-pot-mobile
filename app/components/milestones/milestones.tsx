'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useContext, useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'

const Milestones = () => {
    const {
        customer,
        autoRedeemError,
        autoRedeemSuccessMessage,
        unredeemedBalance,
    } = useContext(MobileAppContext)
    const [journiePointsCalculated, setJourniePointsCalculated] =
        useState<number>(0)

    const journiePoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points

    //USEEFFECT HAVE TO BE CHANGED
    useEffect(() => {
        if (journiePoints && unredeemedBalance) {
            setJourniePointsCalculated(journiePoints - unredeemedBalance)
        } else {
            setJourniePointsCalculated(journiePoints || 0)
        }
    }, [journiePoints, unredeemedBalance])

    return (
        <div className="p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">
                        {journiePointsCalculated}
                    </span>
                </h4>
            </header>
            <MilestoneChart />
            {autoRedeemSuccessMessage && (
                <Toast
                    toastType="success"
                    toastText={autoRedeemSuccessMessage}
                />
            )}
            {autoRedeemError && (
                <Toast toastType="error" toastText={autoRedeemError} />
            )}
        </div>
    )
}

export default Milestones

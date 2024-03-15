'use client'
import MilestoneChart from '@/app/components/milestones/milestone-chart'
import { useGetCustomer } from '@/app/hooks/useGetCustomer'
import { CAMPAIGNS } from '@/enum/campaigns'

const Milestones = () => {
    const { customer } = useGetCustomer()
    const mainLoyaltyPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM]
            ?.points || 0
    const promoPoints =
        customer?.loyalty.campaigns?.[CAMPAIGNS.PROMO_POINTS_REWARDS_PROGRAM]
            ?.points || 0

    return (
        <div className="p-4">
            <header className="mb-2">
                <h4 className="text-blue-text text-16">
                    Your Points
                    <span className="pl-2 font-extrabold">
                        {mainLoyaltyPoints}
                    </span>
                </h4>
            </header>
            <MilestoneChart
                mainLoyaltyPoints={mainLoyaltyPoints}
                customerId={customer?.id}
                promoPoints={promoPoints}
            />
        </div>
    )
}

export default Milestones

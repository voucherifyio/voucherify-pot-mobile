import JournieHeader from '@/app/components/journie-header/journie-header'
import Rewards from '@/app/components/rewards/rewards'

export default function RewardsPage() {
    return (
        <div className="h-screen items-center justify-center">
            <JournieHeader headerText={'Journie Rewards'} />
            <Rewards />
        </div>
    )
}

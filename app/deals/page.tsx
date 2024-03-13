import JournieHeader from '@/app/components/journie-header/journie-header'
import Deals from '@/app/components/deals/deals'

export default function DealsPage() {
    return (
        <div className="h-screen items-center justify-center">
            <JournieHeader headerText={'JOURNIE Deals'} />
            <Deals />
        </div>
    )
}

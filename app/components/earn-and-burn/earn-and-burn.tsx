import { getMemberRewards } from '@/app/apiEndpoints/apiEndpoints'
import { CAMPAIGNS } from '@/enum/campaigns'
import { useContext, useEffect, useState } from 'react'
import { MobileAppContext } from '../app-context/app-context'
import Loading from '../loading/loading'

const EarnAndBurnRewards = () => {
    const [rewards, setRewards] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | undefined>(undefined)
    const { customer } = useContext(MobileAppContext)

    const listMemberRewards = async (customerId: string | null | undefined) => {
        const res = await getMemberRewards(
            customerId,
            CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN
        )
        const { rewards, error } = await res.json()

        if (error) {
            setLoading(false)
            return setError(error)
        }
        setRewards(rewards)
        setLoading(false)
    }
    useEffect(() => {
        if (customer?.id) {
            listMemberRewards(customer?.id)
        }
    }, [customer?.id])

    if (loading) return <Loading />

    if (error)
        return (
            <div className="flex-1 w-full h-full flex justify-center items-center">
                <p className="mb-4 text-[14px] font-bold text-blue-text">
                    {error}
                </p>
            </div>
        )
    return <div>siema</div>
}

export default EarnAndBurnRewards

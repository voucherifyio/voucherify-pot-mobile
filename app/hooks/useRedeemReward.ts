import { CustomerObject } from '@voucherify/sdk'
import { getQualifications, redeemReward } from '../apiEndpoints/apiEndpoints'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { useState } from 'react'

export const useRedeemReward = () => {
    const [rewardErrorMessage, setRewardErrorMessage] = useState<
        string | undefined
    >(undefined)
    const [rewardSuccessMessage, setRewardSuccessMessage] = useState<
        string | undefined
    >(undefined)

    const redeemCustomerReward = async (
        customer: CustomerObject | undefined,
        rewardId: string,
        campaignName: string
    ): Promise<{ status: 'success' | 'error' }> => {
        if (!customer?.id) {
            setRewardErrorMessage('Customer id does not exist.')
            return { status: 'error' }
        }

        const res = await redeemReward(customer?.id, rewardId, campaignName)
        const { redeemedReward, error } = await res.json()
        if (error) {
            setRewardErrorMessage(error)
            return { status: 'error' }
        }
        const reward = redeemedReward.reward?.voucher?.code

        if (reward && customer?.id) {
            return new Promise((resolve) => {
                const interval: NodeJS.Timeout = setInterval(async () => {
                    const data = await fetchQualifications(customer.id, reward)
                    if (data?.status === 'success') {
                        clearInterval(interval)
                        resolve({
                            status: data.status,
                        })
                    }
                }, 2000)
            })
        }

        return { status: 'error' }
    }

    const fetchQualifications = async (customerId: string, reward: string) => {
        const res = await getQualifications(
            customerId,
            QUALIFICATION_SCENARIO.AUDIENCE_ONLY
        )
        const data = await res.json()
        const qualifications = data.qualifications
        for (const qualification of qualifications) {
            if (qualification.id === reward) {
                setRewardSuccessMessage('Voucher has been generated')
                setTimeout(() => setRewardSuccessMessage(undefined), 3000)
                return { status: 'success' }
            }
        }
    }

    return {
        redeemCustomerReward,
        rewardErrorMessage,
        rewardSuccessMessage,
    }
}

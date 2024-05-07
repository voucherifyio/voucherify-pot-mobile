import { CustomerObject } from '@voucherify/sdk'
import { getQualifications, redeemReward } from '../apiEndpoints/apiEndpoints'
import { useState } from 'react'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'

export const useRedeemReward = () => {
    const redeemCustomerReward = async (
        customer: CustomerObject | undefined,
        rewardId: string,
        campaignName: string
    ): Promise<{ status: 'success' | 'error'; message?: string }> => {
        if (!customer?.id) {
            throw new Error('Customer id does not exist.')
        }

        const res = await redeemReward(customer?.id, rewardId, campaignName)
        const { redeemedReward } = await res.json()
        if (res.status !== 200) {
            console.error('Cannot redeem reward')
            throw new Error(
                'Cannot redeem reward for some reason, please check audit log.'
            )
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
                            message: 'Voucher has been generated',
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
                return { status: 'success' }
            }
        }
    }

    return {
        redeemCustomerReward,
    }
}

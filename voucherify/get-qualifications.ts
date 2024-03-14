import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
    scenario: 'AUDIENCE_ONLY'
    options?: {
        limit?: number
        expand?: ['reedemable']
    }
}

export const getQualifications = async (params: Params) => {
    const JOURNIE_LOYALTY_CAMPAIGN_NAME = 'Journie PoT Loyalty Program'
    const { voucherify, customerId, scenario } = params
    try {
        if (customerId && scenario) {
            const qualifications =
                await voucherify.qualifications.checkEligibility({
                    customer: {
                        source_id: customerId,
                    },
                    mode: 'BASIC',
                    scenario: scenario,
                    options: {
                        limit: 100,
                        expand: ['redeemable'],
                    },
                })

            qualifications.redeemables.data =
                qualifications.redeemables.data.filter(
                    (redeemable) =>
                        redeemable.object === 'promotion_tier' ||
                        redeemable.object === 'voucher'
                )
            return qualifications
        } else {
            console.error(
                `Could not get qualifications for campaign: ${JOURNIE_LOYALTY_CAMPAIGN_NAME}`
            )
        }
    } catch (err) {
        console.error(err)
    }
}

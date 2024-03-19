import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
    customerMetadata?: {
        unique_locations_purchased_at?: number
    }
    scenario: QUALIFICATION_SCENARIO.AUDIENCE_ONLY
    options?: {
        limit?: number
        expand?: ['reedemable']
    }
}

export const getQualifications = async (params: Params) => {
    const { voucherify, customerId, scenario, customerMetadata } = params
    try {
        if (customerId && scenario) {
            return await voucherify.qualifications.checkEligibility({
                customer: {
                    source_id: customerId,
                    metadata: customerMetadata,
                },
                mode: 'BASIC',
                scenario: scenario,
                options: {
                    limit: 100,
                    expand: ['redeemable'],
                },
            })
        } else {
            console.error(
                `[voucherify/qualifications] Missing customerId or scenario`
            )
        }
    } catch (err: any) {
        console.error(`Could not get qualifications.`)
        throw new Error(err?.message)
    }
}

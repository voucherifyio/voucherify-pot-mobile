import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'
import { CAMPAIGNS } from '@/enum/campaigns'
import { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
    const { customerId, scenario, customerMetadata } = await req.json()

    if (!customerId) {
        return Response.json(
            { error: 'Customer does not exist.' },
            { status: 400 }
        )
    }

    try {
        const qualifications = await getQualifications({
            customerId: customerId,
            voucherify: getVoucherify(),
            scenario: scenario,
            customerMetadata: customerMetadata,
        })

        if (qualifications) {
            if (customerMetadata) {
                const conditionalCampaign =
                    qualifications.redeemables.data.filter(
                        (redeemable) =>
                            redeemable.name ===
                            CAMPAIGNS.FREE_COCA_COCA_CAMPAIGN
                    )
                return Response.json(
                    { qualifications: conditionalCampaign },
                    { status: 200 }
                )
            }
            const promotionTiersAndVouchers =
                qualifications.redeemables.data.filter(
                    (redeemable) =>
                        (redeemable.object === 'promotion_tier' ||
                            redeemable.object === 'voucher') &&
                        !redeemable.result.loyalty_card
                )

            return Response.json(
                { qualifications: promotionTiersAndVouchers },
                { status: 200 }
            )
        }
    } catch (err) {
        return Response.json({ status: 400 })
    }
}

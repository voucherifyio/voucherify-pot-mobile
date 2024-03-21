import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'
export async function POST(req: Request) {
    const { customerId, scenario, customerMetadata } = await req.json()

    try {
        const qualifications = await getQualifications({
            customerId: customerId,
            voucherify: getVoucherify(),
            scenario: scenario,
        })

        if (qualifications) {
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

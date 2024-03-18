import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'
export async function POST(req: Request) {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')

    if (customerId) {
        try {
            const promotionTiersAndVouchers = await getQualifications({
                customerId: customerId,
                voucherify: getVoucherify(),
                scenario: 'AUDIENCE_ONLY',
            })

            return Response.json(
                { qualifications: promotionTiersAndVouchers },
                { status: 200 }
            )
        } catch (err) {
            return Response.json({ status: 400 })
        }
    }
}

import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'
export async function POST(req: Request) {
    const { customerId, scenario } = await req.json()

    try {
        const promotionTiersAndVouchers = await getQualifications({
            customerId: customerId,
            voucherify: getVoucherify(),
            scenario: scenario,
        })

        return Response.json(
            { qualifications: promotionTiersAndVouchers },
            { status: 200 }
        )
    } catch (err) {
        return Response.json({ status: 400 })
    }
}

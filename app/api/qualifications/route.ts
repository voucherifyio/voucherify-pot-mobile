import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'
import { getVoucherBarcode } from '@/voucherify/get-voucher-barcode'

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')

    if (customerId) {
        const promotionTiersAndVouchers = await getQualifications({
            customerId: customerId,
            voucherify: getVoucherify(),
            scenario: 'AUDIENCE_ONLY',
        })

        return Response.json(
            { qualifications: promotionTiersAndVouchers },
            { status: 200 }
        )
    }
    return Response.json({ status: 400 })
}

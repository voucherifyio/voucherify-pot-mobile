import { getVoucherify } from '@/voucherify/voucherify-config'
import { getVoucher } from '@/voucherify/get-voucher'
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const coupon = searchParams.get('coupon')

    if (coupon) {
        const voucher = await getVoucher({
            coupon,
            voucherify: getVoucherify(),
        })

        if (voucher?.assets?.barcode) {
            const barcode = voucher?.assets?.barcode
            return Response.json({ barcode }, { status: 200 })
        }
    }
    return Response.json({ status: 400 })
}

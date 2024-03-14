import { getVoucherify } from '@/voucherify/voucherify-config'
import { validateCoupon } from '@/voucherify/validate-coupon'
import { getVoucherBarcode } from '@/voucherify/get-voucher-barcode'

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url)
    const coupon = searchParams.get('coupon')

    if (coupon) {
        const validCoupons = await validateCoupon({
            coupon,
            voucherify: getVoucherify(),
        })

        const barcode = await getVoucherBarcode({
            coupon,
            voucherify: getVoucherify(),
        })

        return Response.json(
            { validCoupons: { ...validCoupons, barcode: barcode } },
            { status: 200 }
        )
    }
    return Response.json({ status: 400 })
}

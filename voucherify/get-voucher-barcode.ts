import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    coupon: string
}

export const getVoucherBarcode = async (params: Params) => {
    const { voucherify, coupon } = params

    try {
        if (coupon) {
            const voucher = await voucherify.vouchers.get(coupon)

            const barcode = voucher?.assets?.barcode
            if (barcode) {
                return barcode
            } else {
                console.error(`Could not find voucher`)
            }
        }
    } catch (err) {
        console.error(err)
    }
}

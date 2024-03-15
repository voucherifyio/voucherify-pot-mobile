import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    coupon: string
}

export const getVoucher = async (params: Params) => {
    const { voucherify, coupon } = params

    try {
        if (coupon) {
            return await voucherify.vouchers.get(coupon)
        }
    } catch (err) {
        console.error(err)
    }
}

import {
    CustomerObject,
    ValidationsValidateStackableParams,
    VoucherifyServerSide,
} from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    coupon: string
}

export const validateCoupon = async (params: Params) => {
    const { voucherify, coupon } = params

    try {
        const validationResponse =
            (await voucherify.validations.validateStackable({
                redeemables: [
                    {
                        object: 'voucher',
                        id: coupon,
                    },
                ],
                // session: {
                //     key: 'LOCK',
                //     type: 'LOCK',
                // },
            })) as ValidationsValidateStackableParams

        return validationResponse
    } catch (err) {
        return null
    }
}

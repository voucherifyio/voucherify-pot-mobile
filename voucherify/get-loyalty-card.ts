import { CAMPAIGNS } from '@/enum/campaigns'
import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
}

export const getLoyaltyCard = async (params: Params) => {
    const { voucherify, customerId } = params

    try {
        if (customerId) {
            const vouchers = await voucherify.vouchers.list({
                customer: customerId,
                campaign: CAMPAIGNS.LOYALTY_PROGRAM,
            })
            const loyaltyCard = vouchers.vouchers.find(
                (voucher) => voucher.campaign === CAMPAIGNS.LOYALTY_PROGRAM
            )

            if (loyaltyCard) {
                const barcode = loyaltyCard?.assets?.barcode
                const code = loyaltyCard?.code
                return { barcode, code }
            } else {
                console.error(
                    `Could not find loyalty card for campaign: ${CAMPAIGNS.LOYALTY_PROGRAM}`
                )
            }
        }
    } catch (err) {
        console.error(err)
    }
}

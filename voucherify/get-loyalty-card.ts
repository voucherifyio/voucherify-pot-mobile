import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
}

export const getLoyaltyCard = async (params: Params) => {
    const JOURNIE_LOYALTY_CAMPAIGN_NAME = 'Journie PoT Loyalty Program'
    const { voucherify, customerId } = params

    try {
        if (customerId) {
            const vouchers = await voucherify.vouchers.list({
                customer: customerId,
                campaign: JOURNIE_LOYALTY_CAMPAIGN_NAME,
            })
            const journieLoyaltyCard = vouchers.vouchers.find(
                (voucher) => voucher.campaign === JOURNIE_LOYALTY_CAMPAIGN_NAME
            )

            if (journieLoyaltyCard) {
                const barcode = journieLoyaltyCard?.assets?.barcode
                const code = journieLoyaltyCard?.code
                return { barcode, code }
            } else {
                console.error(
                    `Could not find loyalty card for campaign: ${JOURNIE_LOYALTY_CAMPAIGN_NAME}`
                )
            }
        }
    } catch (err) {
        console.error(err)
    }
}

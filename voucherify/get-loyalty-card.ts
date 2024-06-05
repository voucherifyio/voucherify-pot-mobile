import { VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    customerId: string
    campaignName: string
}

export const getLoyaltyCard = async (params: Params) => {
    const { voucherify, customerId, campaignName } = params

    try {
        if (customerId) {
            const vouchers = await voucherify.vouchers.list({
                customer: customerId,
                campaign: campaignName,
            })
            const loyaltyCard = vouchers.vouchers.find(
                (voucher) => voucher.campaign === campaignName
            )

            if (loyaltyCard) {
                const barcode = loyaltyCard?.assets?.barcode
                const code = loyaltyCard?.code
                return { barcode, code }
            } else {
                console.error(
                    `Could not find loyalty card for campaign: ${campaignName}`
                )
            }
        }
    } catch (err) {
        console.error(err)
    }
}

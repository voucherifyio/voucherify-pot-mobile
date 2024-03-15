import { getVoucherify } from '@/voucherify/voucherify-config'
import { getLoyaltyCard } from '@/voucherify/get-loyalty-card'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')

    if (customerId) {
        const loyaltyCard = await getLoyaltyCard({
            customerId: customerId,
            voucherify: getVoucherify(),
        })
        return Response.json({ loyaltyCard: loyaltyCard }, { status: 200 })
    }
    return Response.json({ status: 400 })
}

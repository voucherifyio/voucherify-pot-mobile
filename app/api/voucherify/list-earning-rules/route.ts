import { getVoucherify } from '@/voucherify/voucherify-config'
import { listEarningRules } from '@/voucherify/list-earning-rules'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')

    if (campaignId) {
        const earningRules = await listEarningRules({
            campaignId: campaignId,
            voucherify: getVoucherify(),
        })
        return Response.json({ earningRules: earningRules }, { status: 200 })
    }
    return Response.json({ status: 400 })
}

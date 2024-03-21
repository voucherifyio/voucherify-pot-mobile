import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'
import { getCampaign } from '@/voucherify/get-campaign'

export async function GET(req: NextRequest) {
    const campaignId = req.nextUrl.searchParams.get('campaignId')
    if (campaignId) {
        const campaign = await getCampaign({
            campaignId: campaignId,
            voucherify: getVoucherify(),
        })

        if (!campaign?.id) {
            return NextResponse.json(
                { error: 'Campaign does not exist, please try again' },
                { status: 404 }
            )
        }

        if (campaign?.id) {
            return NextResponse.json({ campaign }, { status: 200 })
        }
    }
}

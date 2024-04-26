import { listVouchers } from '@/voucherify/list-vouchers'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const campaignName = req.nextUrl.searchParams.get('campaignName')
    const customerSourceId = req.nextUrl.searchParams.get('customerSourceId')

    if (!campaignName || !customerSourceId) {
        return NextResponse.json(
            {
                error: 'Missing one of property [customerSourceId, campaignName]',
            },
            { status: 400 }
        )
    }

    const { vouchers } = await listVouchers({
        campaignName,
        customerIdOrSourceId: customerSourceId,
        voucherify: getVoucherify(),
    })

    return NextResponse.json({ vouchers }, { status: 200 })
}

import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'
import { listCustomerSegments } from '@/voucherify/get-customer-segments'

export async function GET(req: NextRequest) {
    const customerId = req.nextUrl.searchParams.get('customerId')
    if (customerId) {
        const customerSegments = await listCustomerSegments({
            customerId: customerId,
            voucherify: getVoucherify(),
        })

        if (!customerSegments) {
            return NextResponse.json(
                { error: 'Customer does not exist, please try again' },
                { status: 404 }
            )
        }

        if (customerSegments) {
            return NextResponse.json({ customerSegments }, { status: 200 })
        }
    }
}

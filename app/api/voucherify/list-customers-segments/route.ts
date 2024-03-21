import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'
import { getCustomersSegments } from '@/voucherify/get-customers-segments'

export async function GET(req: NextRequest) {
    const customerId = req.nextUrl.searchParams.get('customerId')
    if (customerId) {
        const customersSegments = await getCustomersSegments({
            customerId: customerId,
            voucherify: getVoucherify(),
        })

        if (!customersSegments) {
            return NextResponse.json(
                { error: 'Customer does not exist, please try again' },
                { status: 404 }
            )
        }

        if (customersSegments) {
            return NextResponse.json({ customersSegments }, { status: 200 })
        }
    }
}

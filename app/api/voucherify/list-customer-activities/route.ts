import { listCustomerActivities } from '@/voucherify/list-customer-activities'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const customerId = req.nextUrl.searchParams.get('customerId')

    if (!customerId) {
        return NextResponse.json(
            { error: 'Customer id is empty' },
            { status: 404 }
        )
    }

    const activities = await listCustomerActivities({
        customerId,
        voucherify: getVoucherify(),
    })

    return NextResponse.json({ activities }, { status: 200 })
}

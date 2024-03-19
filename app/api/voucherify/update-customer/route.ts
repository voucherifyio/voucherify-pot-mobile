import { NextRequest, NextResponse } from 'next/server'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { updateCustomer } from '@/voucherify/update-customer'

export async function PUT(req: NextRequest) {
    const customerBody = await req.json()
    if (customerBody) {
        const customer = await updateCustomer({
            customerBody,
            voucherify: getVoucherify(),
        })

        if (customer) {
            return NextResponse.json({ customer }, { status: 200 })
        }
        return NextResponse.json({
            error: 'Cannot update customer',
            status: 400,
        })
    }
}

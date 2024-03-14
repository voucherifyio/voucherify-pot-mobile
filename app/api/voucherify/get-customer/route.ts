import { getCustomer } from '@/voucherify/get-customer'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const phone = req.nextUrl.searchParams.get('phone')
    if (phone) {
        const customer = await getCustomer({
            customer: { phone: phone },
            voucherify: getVoucherify(),
        })

        if (!customer?.id) {
            return NextResponse.json(
                { error: 'User does not exist, please try again' },
                { status: 404 }
            )
        }

        if (customer?.id) {
            return NextResponse.json({ customer }, { status: 200 })
        }
    }
}

import { getCustomer } from '@/voucherify/get-customer'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'
import { Analytics } from '@segment/analytics-node'

type Customer = {
    firstName?: string
    lastName?: string
    phone: string
    password?: string
}

const getAnalalitycs = () => {
    if (!process.env.SEGMENTIO_SOURCE_WRITE_KEY) {
        throw new Error(
            'SEGMENTIO_SOURCE_WRITE_KEY not defined in env variables'
        )
    }

    return new Analytics({ writeKey: process.env.SEGMENTIO_SOURCE_WRITE_KEY })
}

export async function POST(req: NextRequest) {
    const body: Customer = await req.json()

    let voucherifyCustomer = await getCustomer({
        customer: { ...body },
        voucherify: getVoucherify(),
    })

    if (voucherifyCustomer?.source_id === body.phone) {
        return NextResponse.json(
            { error: 'Customer already exist, please login.' },
            { status: 400 }
        )
    }

    if (!voucherifyCustomer?.id) {
        const analitycs = getAnalalitycs()
        analitycs.identify({
            userId: body.phone,
            traits: {
                phone: body.phone,
                firstName: body?.firstName,
                lastName: body?.lastName,
            },
        })

        const customer = {
            source_id: body.phone,
        }

        return NextResponse.json(
            { source_id: customer.source_id },
            { status: 200 }
        )
    }
}

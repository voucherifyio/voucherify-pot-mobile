import { getCustomer } from '@/voucherify/get-customer'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextRequest, NextResponse } from 'next/server'
import { Analytics } from '@segment/analytics-node'
import { METADATA } from '@/enum/metadata'

type Customer = {
    firstName?: string
    lastName?: string
    phone: string
    password?: string
    email?: string
    postalCode?: string
}

type ModifiedBaseUserTraits = {
    postalCode?: string
}

const getAnalytics = () => {
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

    if (
        voucherifyCustomer?.source_id === body.phone &&
        voucherifyCustomer?.metadata[METADATA.REGISTERED_CUSTOMER] === true
    ) {
        return NextResponse.json(
            { error: 'Customer already registered, please login.' },
            { status: 400 }
        )
    }

    if (
        !voucherifyCustomer?.id ||
        (voucherifyCustomer.id &&
            !voucherifyCustomer.metadata[METADATA.REGISTERED_CUSTOMER])
    ) {
        const analitycs = getAnalytics()
        analitycs.identify({
            userId: body.phone,
            traits: {
                phone: body.phone,
                first_name: body?.firstName,
                last_name: body?.lastName,
                email: body?.email,
                address: {
                    postalCode: body?.postalCode,
                } as ModifiedBaseUserTraits,
                metadata: {
                    registered_customer: true,
                },
            },
        })

        return NextResponse.json({ source_id: body.phone }, { status: 200 })
    }
}

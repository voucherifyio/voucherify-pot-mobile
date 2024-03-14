import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')

    if (customerId) {
        const qualifications = await getQualifications({
            customerId: customerId,
            voucherify: getVoucherify(),
            scenario: 'AUDIENCE_ONLY',
        })

        return Response.json(
            { qualifications: qualifications },
            { status: 200 }
        )
    }
    return Response.json({ status: 400 })
}

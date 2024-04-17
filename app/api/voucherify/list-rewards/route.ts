import { listRewards } from '@/voucherify/list-rewards'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { NextResponse } from 'next/server'

export async function GET() {
    const rewards = await listRewards({ voucherify: getVoucherify() })
    
    if (!rewards) {
        return NextResponse.json(
            { error: 'No active rewards' },
            { status: 404 }
        )
    }

    return NextResponse.json({ rewards }, { status: 200 })
}

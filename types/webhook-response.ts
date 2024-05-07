export type WebhookResponse = {
    id: string
    project_id: string
    created_at: string
    type: string
    data: {
        balance: {
            type: string
            total: number
            object: string
            points: number
            balance: number
            operation_type: string
            related_object: {}
        }
        voucher: {
            id: string
            code: string
            type: string
            active: boolean
            object: string
            campaign: string
            metadata: {}
            holder_id: string
            categories: []
            created_at: string
            redemption: []
            start_date: null | string
            updated_at: string
            campaign_id: string
            category_id: null | string
            loyalty_card: []
            expiration_date: null | string
            is_referral_code: boolean
        }
        campaign: {
            id: string
            name: string
            type: string
            active: boolean
            object: string
            voucher: []
            category: null | string
            metadata: {}
            auto_join: boolean
            join_once: boolean
            created_at: string
            start_date: null | string
            updated_at: string
            category_id: null | string
            description: null | string
            campaign_type: string
            expiration_date: null | string
            is_referral_code: boolean
        }
        customer: {
            id: string
            name: string | null
            email: null | string
            object: string
            metadata: []
            source_id: string
        }
        transaction: {
            id: string
            type: string
            reason: null | string
            source: string
            details: []
            source_id: null | string
            created_at: string
            voucher_id: string
            campaign_id: string
            related_transaction_id: null | string
        }
    }
    source: {
        id: string
        object: string
        target_url: string
    }
    event: {
        id: string
        type: string
        created_at: string
        group_id: string
        event_source: { channel: string }
    }
}

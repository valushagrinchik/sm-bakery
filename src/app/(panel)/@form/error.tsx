'use client'

import { FormModalLayout } from '@/shared/ui'
import Error from '../error'

export default function FormError(props: any) {
    return (
        <FormModalLayout>
            <Error {...props} />
        </FormModalLayout>
    )
}

import { EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { z } from 'zod'

export const editCountrySchema = z.object({
    name: z.string().trim().min(1, {
        message: 'IS_NOT_EMPTY',
    }),
    inventoryId: z
        .string()
        .trim()
        .min(1, {
            message: 'IS_NOT_EMPTY',
        })
        .max(36, {
            message: 'TOO_BIG',
        })
        .refine(
            value =>
                value.match(
                    /[a-zA-Z\d]{8}-[a-zA-Z\d]{4}-4[a-zA-Z\d]{3}-[89AB]{1}[a-zA-Z\d]{3}-[a-zA-Z\d]{12}/
                ),
            'INVALID'
        ),
    status: z.nativeEnum(EntityStatus),
    // currency code
    code: z.string().trim().min(1, {
        message: 'IS_NOT_EMPTY',
    }),
    phoneCode: z.string().trim().min(1, {
        message: 'IS_NOT_EMPTY',
    }),
    // currency symbol
    currency: z.string().trim().min(1, {
        message: 'IS_NOT_EMPTY',
    }),
})

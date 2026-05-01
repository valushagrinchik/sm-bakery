import { z } from 'zod'

export const versionSchema = z.object({
    customerAppAndroid: z
        .string({ message: 'IS_STRING' })
        .min(1, 'IS_NOT_EMPTY')
        .regex(/^[0-9]{1,2}(\.[0-9]{1,2}){0,2}$/, 'IS_VERSION'),
    customerAppIos: z
        .string({ message: 'IS_STRING' })
        .min(1, 'IS_NOT_EMPTY')
        .regex(/^[0-9]{1,2}(\.[0-9]{1,2}){0,2}$/, 'IS_VERSION'),
    operatorAppAndroid: z
        .string({ message: 'IS_STRING' })
        .min(1, 'IS_NOT_EMPTY')
        .regex(/^[0-9]{1,2}(\.[0-9]{1,2}){0,2}$/, 'IS_VERSION'),
    operatorAppIos: z
        .string({ message: 'IS_STRING' })
        .min(1, 'IS_NOT_EMPTY')
        .regex(/^[0-9]{1,2}(\.[0-9]{1,2}){0,2}$/, 'IS_VERSION'),
})

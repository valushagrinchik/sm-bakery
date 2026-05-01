import { Role } from '@/shared/enums/role'
import { z } from 'zod'

export const userSchema = z
    .object({
        email: z
            .string()
            .regex(/^\S+$/, 'INVALID_FIELD')
            .toLowerCase()
            .min(1, 'IS_NOT_EMPTY')
            .max(75, 'IS_TOO_LONG')
            .email({ message: 'IS_EMAIL' }),
        firstName: z
            .string({ message: 'IS_STRING' })
            .min(1, 'IS_NOT_EMPTY')
            .regex(/^[a-zA-ZáéíóúüñÑüÃÍÖöŠšé]+$/, 'INVALID_FIELD'),
        lastName: z
            .string({ message: 'IS_STRING' })
            .min(1, 'IS_NOT_EMPTY')
            .regex(/^[a-zA-ZáéíóúüñüãíöšéÁÉÍÓÚÜÑÜÃÍÖŠÉ']+$/, 'INVALID_FIELD'),
        phone: z
            .string({ message: 'IS_NOT_EMPTY' })
            .min(12, 'IS_PHONE')
            .max(24, 'IS_PHONE'),
        countryId: z.number().nullable().optional(),
        roleId: z.number().nullable().optional(),
        storeId: z.number().nullable().optional(),
        deliveryZoneId: z.number().nullable().optional(),
        status: z.string(),
    })
    .refine(data => data.roleId !== Role.STORE_MANAGER || data.storeId, {
        message: 'IS_NOT_EMPTY',
        path: ['storeId'],
    })
    .refine(data => data.roleId !== Role.DELIVERY_MAN || data.deliveryZoneId, {
        message: 'IS_NOT_EMPTY',
        path: ['deliveryZoneId'],
    })

export const userUpdateSchema = z.object({
    email: z
        .string()
        .regex(/^\S+$/, 'INVALID_FIELD')
        .toLowerCase()
        .min(1, 'IS_NOT_EMPTY')
        .max(75, 'IS_TOO_LONG')
        .email({ message: 'IS_EMAIL' }),
    firstName: z
        .string({ message: 'IS_STRING' })
        .min(1, 'IS_NOT_EMPTY')
        .regex(/^[a-zA-ZáéíóúüñÑüÃÍÖöŠšé]+$/, 'INVALID_FIELD'),
    lastName: z
        .string({ message: 'IS_STRING' })
        .min(1, 'IS_NOT_EMPTY')
        .regex(/^[a-zA-ZáéíóúüñüãíöšéÁÉÍÓÚÜÑÜÃÍÖŠÉ']+$/, 'INVALID_FIELD'),
    phone: z
        .string({ message: 'IS_NOT_EMPTY' })
        .min(12, 'IS_PHONE')
        .max(24, 'IS_PHONE'),
})

export const signInSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, 'IS_NOT_EMPTY')
        .email({ message: 'IS_EMAIL' }),
    password: z.string().min(8, 'IS_PASSWORD'),
})

export const sendResetPasswordCodeSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'IS_NOT_EMPTY')
        .email({ message: 'IS_EMAIL' }),
})

export const verifyEmailSchema = z.object({
    code: z.string().min(1, 'IS_NOT_EMPTY'),
})

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .regex(/^[^ ].+[^ ]$/, 'IS_PASSWORD')
            .min(8, 'IS_PASSWORD')
            .max(20, 'IS_PASSWORD')
            .regex(
                /^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+= ]+$/,
                'IS_PASSWORD'
            ),
        repeatPassword: z.string(),
    })
    .refine(data => data.newPassword === data.repeatPassword, {
        message: 'PASSWORDS_NOT_MATCH',
        path: ['repeatPassword'],
    })

export const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(8, 'IS_PASSWORD'),
        newPassword: z
            .string()
            .regex(/^[^ ].+[^ ]$/, 'IS_PASSWORD')
            .min(8, 'IS_PASSWORD')
            .max(20, 'IS_PASSWORD')
            .regex(
                /^[a-zA-Z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`+= ]+$/,
                'IS_PASSWORD'
            ),
        repeatPassword: z.string(),
    })
    .refine(data => data.newPassword === data.repeatPassword, {
        message: 'PASSWORDS_NOT_MATCH',
        path: ['repeatPassword'],
    })

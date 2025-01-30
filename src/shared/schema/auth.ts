import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'IS_NOT_EMPTY')
        .email({ message: 'IS_EMAIL' }),
    password: z.string(),
})

export const sendCodeSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'IS_NOT_EMPTY')
        .email({ message: 'IS_EMAIL' }),
})

export const verifyEmailSchema = z.object({
    code: z.string().trim().min(1, 'IS_NOT_EMPTY'),
})

export const newPasswordSchema = z
    .object({
        newPassword: z.string(),
        repeatPassword: z.string(),
    })
    .refine(data => data.newPassword === data.repeatPassword, {
        message: 'PASSWORDS_NOT_MATCH',
        path: ['repeatPassword'],
    })

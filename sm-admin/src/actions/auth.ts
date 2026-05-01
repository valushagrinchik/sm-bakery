'use server'

import { FetchWrapper } from '@/shared/lib/sanMartinApi/fetchWrapper'
import { sendCodeSchema, verifyEmailSchema } from '@/shared/schema/auth'
import { resetPasswordSchema, signInSchema } from '@/shared/schema/user'
import { FormState } from '@/shared/types/form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(_: FormState, formData: FormData) {
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || ''
    )

    const rawFormData = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const loginData = signInSchema.safeParse(rawFormData)
    if (!loginData.success) {
        return {
            errors: {
                email:
                    loginData?.error?.flatten()?.fieldErrors?.email &&
                    loginData?.error?.flatten()?.fieldErrors?.email![0],
                password:
                    loginData?.error?.flatten()?.fieldErrors?.password &&
                    loginData?.error?.flatten()?.fieldErrors?.password![0],
            },
            fields: rawFormData,
            success: false,
        } as any
    }
    const res = await fetchWrapper.post('/auth/user/sign-in', {}, rawFormData)

    if (!res.ok) {
        return {
            errors: {
                password: 'invalid_email_or_password',
            },
            fields: rawFormData,
            success: false,
        } as FormState
    }

    const cookieStore = await cookies()
    cookieStore.set({
        name: 'access_token',
        value: res?.data?.accessToken,
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
    })

    redirect('/')
}

export async function sendResetPasswordCode(
    _: FormState & { email?: string },
    formData: FormData
) {
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || ''
    )

    const rawFormData = {
        email: formData.get('email'),
    }

    const emailData = sendCodeSchema.safeParse(rawFormData)
    if (!emailData.success) {
        return {
            errors: {
                email:
                    emailData?.error?.flatten()?.fieldErrors?.email &&
                    emailData?.error?.flatten()?.fieldErrors?.email![0],
            },
            fields: rawFormData,
            success: false,
        }
    }

    const res = await fetchWrapper.post(
        `/auth/user/send-reset-password-code/${rawFormData.email}`,
        {}
    )
    if (!res.ok) {
        return {
            errors: {
                email: res.data.message,
            },
            fields: rawFormData,
            success: false,
        } as any
    }
    return {
        errors: {},
        fields: rawFormData,
        success: true,
    } as any
}

export async function verifyEmail(
    prevState: FormState & { email?: string; code?: string },
    formData: FormData
) {
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || ''
    )

    const rawFormData = {
        email: prevState.email as string,
        code: formData.get('code') as string,
    }

    const codeData = verifyEmailSchema.safeParse(rawFormData)
    if (!codeData.success) {
        return {
            errors: {
                code:
                    codeData?.error?.flatten()?.fieldErrors?.code &&
                    codeData?.error?.flatten()?.fieldErrors?.code![0],
            },
            email: prevState.email,
            success: false,
        }
    }

    const res = await fetchWrapper.post(
        '/auth/user/verify-reset-password-code',
        {},
        { email: rawFormData.email!, resetPasswordCode: rawFormData.code }
    )
    if (!res.ok)
        return {
            errors: {
                code: res.data.message,
            },
            success: false,
            email: prevState.email,
        } as any

    return {
        email: prevState.email,
        code: codeData.data.code,
        success: true,
        errors: {},
    } as any
}

export async function resetPassword(prevState: any, formData: FormData) {
    const rawFormData = {
        newPassword: formData.get('newPassword') as string,
        repeatPassword: formData.get('repeatPassword') as string,
    }

    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || ''
    )

    const passwordData = resetPasswordSchema.safeParse(rawFormData)
    if (!passwordData.success) {
        return {
            errors: {
                newPassword:
                    passwordData?.error?.flatten()?.fieldErrors?.newPassword &&
                    passwordData?.error?.flatten()?.fieldErrors
                        ?.newPassword![0],
                repeatPassword:
                    passwordData?.error?.flatten()?.fieldErrors
                        ?.repeatPassword &&
                    passwordData?.error?.flatten()?.fieldErrors
                        ?.repeatPassword![0],
            },
            fields: rawFormData,
            email: prevState.email,
            code: prevState.code,
            success: false,
        } as any
    }

    const body = {
        email: prevState.email,
        resetPasswordCode: prevState.code,
        newPassword: formData.get('newPassword'),
    }

    const res = await fetchWrapper.post('/auth/user/reset-password', {}, body)
    if (!res.ok) {
        return {
            email: prevState.email,
            code: prevState.code,
            success: false,
            errors: {
                newPassword: res?.data?.message,
            } as any,
        }
    }
    redirect('/')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.set({
        name: 'access_token',
        value: '',
        expires: Date.now(),
    })
    redirect('/login')
}

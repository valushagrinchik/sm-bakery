'use client'

import { changePassword } from '@/actions/user'
import FormInput from '@/shared/ui/FormInput'
import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { XIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const ChangePasswordForm = () => {
    const t = useTranslations('login')
    const router = useRouter()
    const [state, action, isPending] = useActionState(changePassword, {
        errors: {},
        fields: {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
        },
        ok: false,
    } as any)
    const [hideErrors, setHideErrors] = useState<{
        oldPassword?: boolean
        newPassword?: boolean
        repeatPassword?: boolean
    }>({})

    useEffect(() => {
        if (state?.ok) {
            toast.success(
                <ToastContent message={t('newPassword.success')} success />,
                { ...(toastOptions as any) }
            )
            router.back()
        }
    }, [state?.ok])

    return (
        <form
            action={action}
            onSubmit={() => setHideErrors({})}
            className='w-full flex flex-col h-screen'
        >
            <div className='w-full flex items-center px-8 min-h-20 bg-brand-dark'>
                <p className='flex-auto text-lg text-white font-semibold'>
                    {t('newPassword.change')}
                </p>
                <div
                    className='p-2 cursor-pointer'
                    onClick={() => router.back()}
                >
                    <XIcon className='h-4 w-4 text-white' />
                </div>
            </div>
            <div className='w-full flex flex-col p-6 gap-4 flex-auto'>
                <FormInput
                    name='oldPassword'
                    type='password'
                    defaultValue={state?.fields?.oldPassword}
                    label={t('newPassword.oldPassword')}
                    maxLength={20}
                    error={
                        state?.errors?.oldPassword &&
                        !hideErrors?.oldPassword &&
                        !isPending
                            ? t(`errors.${state?.errors?.oldPassword}`, {
                                  field: t('newPassword.oldPassword'),
                              })
                            : undefined
                    }
                    onFocus={() =>
                        setHideErrors({ ...hideErrors, oldPassword: true })
                    }
                />
                <FormInput
                    name='newPassword'
                    type='password'
                    maxLength={20}
                    defaultValue={state?.fields?.newPassword}
                    label={t('newPassword.newPassword')}
                    error={
                        state?.errors?.newPassword &&
                        !hideErrors?.newPassword &&
                        !isPending
                            ? t(`errors.${state?.errors?.newPassword}`, {
                                  field: t('newPassword.newPassword'),
                              })
                            : undefined
                    }
                    onFocus={() =>
                        setHideErrors({ ...hideErrors, newPassword: true })
                    }
                />
                <FormInput
                    name='repeatPassword'
                    type='password'
                    defaultValue={state?.fields?.repeatPassword}
                    label={t('newPassword.repeatPassword')}
                    maxLength={20}
                    error={
                        state?.errors?.repeatPassword &&
                        !hideErrors?.repeatPassword &&
                        !isPending
                            ? t(`errors.${state?.errors?.repeatPassword}`, {
                                  field: t('newPassword.repeatPassword'),
                              })
                            : undefined
                    }
                    onFocus={() =>
                        setHideErrors({ ...hideErrors, repeatPassword: true })
                    }
                />
            </div>
            <div className='p-4 border-t border-gray-200 flex gap-4 items-center justify-end'>
                <SecondaryButton size='sm' type='reset'>
                    {t('newPassword.cancel')}
                </SecondaryButton>
                <SubmitButton className='w-fit'>
                    {t('newPassword.update')}
                </SubmitButton>
            </div>
        </form>
    )
}

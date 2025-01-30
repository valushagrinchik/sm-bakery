import { sendResetPasswordCode } from '@/actions/auth'
import { FormState } from '@/shared/types/form'
import FormInput from '@/shared/ui/FormInput'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useActionState, useState } from 'react'

const initialState: FormState & { email?: string } = {
    success: false,
    fields: {
        email: '',
    },
    errors: {},
}

export default function SendCodeForm({
    setCurrentForm,
    setEmail,
}: {
    setCurrentForm: (form: 'sendCode' | 'verifyEmail' | 'newPassword') => void
    setEmail: (email: string) => void
}) {
    const t = useTranslations('login')
    const [state, action, isPending] = useActionState(
        sendResetPasswordCode,
        initialState
    )
    const [hideErrors, setHideErrors] = useState<{ email?: boolean }>({})

    if (state.success) {
        setCurrentForm('verifyEmail')
        setEmail((state.fields?.email as string) || '')
    }

    return (
        <form
            action={action}
            onSubmit={() => setHideErrors({})}
            className='w-full flex flex-col gap-6'
        >
            <div className='flex flex-col gap-2'>
                <Link href={{ pathname: '/login' }} className='cursor-pointer'>
                    <ArrowLeftIcon className='h-6 w-6 mb-2 text-gray-900' />
                </Link>
                <h1 className='font-bold text-2xl text-gray-900'>
                    {t('resetPassword.title')}
                </h1>
                <h2 className='ml-auto text-gray-600 text-sm font-medium'>
                    {t('resetPassword.subtitle')}
                </h2>
            </div>
            <div className='w-full flex flex-col gap-4'>
                <FormInput
                    name='email'
                    type='email'
                    maxLength={75}
                    defaultValue={state?.fields?.email}
                    label={t('resetPassword.email')}
                    onFocus={() => setHideErrors({ email: true })}
                    error={
                        state?.errors?.email && !hideErrors?.email && !isPending
                            ? t(`errors.${state?.errors?.email}`, {
                                  field: t('resetPassword.email'),
                              })
                            : undefined
                    }
                />
            </div>
            <SubmitButton>{t('resetPassword.confirm')}</SubmitButton>
        </form>
    )
}

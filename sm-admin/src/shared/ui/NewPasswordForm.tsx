import { resetPassword } from '@/actions/auth'
import FormInput from '@/shared/ui/FormInput'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useActionState, useState } from 'react'

export default function NewPasswordForm({
    email,
    code,
    setCurrentForm,
}: {
    email: string
    code: string
    setCurrentForm: (form: 'sendCode' | 'verifyEmail' | 'newPassword') => void
}) {
    const t = useTranslations('login')
    const [state, action, isPending] = useActionState(resetPassword, {
        errors: {},
        fields: {
            newPassword: '',
            repeatPassword: '',
        },
        email,
        code,
        success: false,
    })
    const [hideErrors, setHideErrors] = useState<{
        newPassword?: boolean
        repeatPassword?: boolean
    }>({})

    return (
        <form
            action={action}
            onSubmit={() => setHideErrors({})}
            className='w-full flex flex-col gap-6'
        >
            <div className='flex flex-col gap-2'>
                <ArrowLeftIcon
                    onClick={() => setCurrentForm('verifyEmail')}
                    className='h-6 w-6 mb-2 text-gray-900 cursor-pointer'
                />
                <h1 className='font-bold text-2xl text-gray-900'>
                    {t('newPassword.title')}
                </h1>
            </div>
            <div className='w-full flex flex-col gap-4'>
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
            <SubmitButton>{t('newPassword.confirm')}</SubmitButton>
        </form>
    )
}

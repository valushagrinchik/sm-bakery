import { sendResetPasswordCode, verifyEmail } from '@/actions/auth'
import FormInput from '@/shared/ui/FormInput'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useActionState, useState } from 'react'

export default function VerifyEmailForm({
    email,
    setCode,
    setCurrentForm,
}: {
    email: string
    setCode: (code: string) => void
    setCurrentForm: (form: 'sendCode' | 'verifyEmail' | 'newPassword') => void
}) {
    const t = useTranslations('login')
    const [state, action, isPending] = useActionState(verifyEmail, {
        email,
        fields: {
            code: '',
        },
        errors: {},
        success: false,
    })
    const [hideErrors, setHideErrors] = useState<{ code?: boolean }>({})
    if (state?.success) {
        setCurrentForm('newPassword')
        setCode(state?.code)
    }

    const resendCode = async () => {
        const formData = new FormData()
        formData.append('email', email)
        await sendResetPasswordCode({}, formData)
    }

    return (
        <form
            action={action}
            onSubmit={() => setHideErrors({})}
            className='w-full flex flex-col gap-6'
        >
            <div className='flex flex-col gap-2'>
                <ArrowLeftIcon
                    onClick={() => setCurrentForm('sendCode')}
                    className='h-6 w-6 mb-2 text-gray-900 cursor-pointer'
                />
                <h1 className='font-bold text-2xl text-gray-900'>
                    {t('verifyEmail.title')}
                </h1>
                <h2 className='ml-auto text-gray-600 text-sm font-medium'>
                    {t('verifyEmail.subtitle', {
                        email,
                    })}
                </h2>
            </div>
            <div className='w-full flex flex-col gap-4'>
                <FormInput
                    name='code'
                    type='text'
                    defaultValue={state?.fields?.code}
                    label={t('verifyEmail.code')}
                    onFocus={() => setHideErrors({ ...hideErrors, code: true })}
                    error={
                        state?.errors?.code && !hideErrors?.code && !isPending
                            ? t(`errors.${state?.errors?.code}`, {
                                  field: t('verifyEmail.code'),
                              })
                            : undefined
                    }
                />
            </div>
            <SubmitButton type='submit'>
                {t('verifyEmail.confirm')}
            </SubmitButton>
            <div className='text-sm text-gray-600 flex justify-center items-center gap-2'>
                <p>{t('verifyEmail.notReceived')}</p>
                <p
                    className='text-brand-dark font-semibold cursor-pointer hover:text-brand-light active:text-brand-dark'
                    onClick={resendCode}
                >
                    {t('verifyEmail.resend')}
                </p>
            </div>
        </form>
    )
}

'use client'

import { signIn } from '@/actions/auth'
import { FormState } from '@/shared/types/form'
import FormInput from '@/shared/ui/FormInput'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useActionState, useRef, useState } from 'react'

const initalState: FormState = {
    success: false,
    fields: {
        email: '',
        password: '',
    },
}

const LoginForm = () => {
    const [state, action, isPending] = useActionState(signIn, initalState)
    const formRef = useRef<HTMLFormElement>(null)
    const t = useTranslations('login')
    const [hideErrors, setHideErrors] = useState({
        email: false,
        password: false,
    })
    return (
        <form
            ref={formRef}
            action={action}
            onSubmit={() => {
                setHideErrors({
                    email: false,
                    password: false,
                })
            }}
            className='w-full flex flex-col gap-6'
        >
            <div className='w-full flex flex-col gap-4'>
                <FormInput
                    type='email'
                    id='email'
                    defaultValue={state?.fields?.email}
                    onFocus={() =>
                        setHideErrors({ ...hideErrors, email: true })
                    }
                    label={t('signIn.email')}
                    maxLength={75}
                    error={
                        !hideErrors.email && state.errors?.email && !isPending
                            ? t(`errors.${state.errors?.email}`, {
                                  field: t('signIn.email'),
                              })
                            : undefined
                    }
                    name='email'
                />
                <div className='w-full flex flex-col gap-1'>
                    <FormInput
                        label={t('signIn.password')}
                        type='password'
                        id='password'
                        defaultValue={state?.fields?.password}
                        error={
                            !hideErrors.password &&
                            state.errors?.password &&
                            !isPending
                                ? t(`errors.${state.errors?.password}`, {
                                      field: t('signIn.password'),
                                  })
                                : undefined
                        }
                        name='password'
                        onFocus={() =>
                            setHideErrors({ ...hideErrors, password: true })
                        }
                        required
                    />
                    <Link
                        href={{ pathname: '/reset-password' }}
                        className='ml-auto text-brand-dark hover:text-brand-light focus:text-brand-dark text-sm font-medium'
                    >
                        {t('signIn.forgotPassword')}
                    </Link>
                </div>
            </div>
            <SubmitButton type='submit'>{t('signIn.confirm')}</SubmitButton>
        </form>
    )
}

export default LoginForm

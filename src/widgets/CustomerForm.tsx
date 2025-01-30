'use client'

import { updateUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { UserResponseDto } from '@/shared/lib/sanMartinApi/Api'
import FormInput from '@/shared/ui/FormInput'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { Select } from '@/shared/ui/Select'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { XIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const CustomerForm = ({ user }: { user: UserResponseDto }) => {
    const t = useTranslations(`panel.form.customer-management.edit`)
    const router = useRouter()
    const initialState = {
        errors: {},
        fields: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            status: user?.status || 'active',
            roleId: user?.roleId || Role.CUSTOMER,
        },
    }
    const [state, action, isPending] = useActionState(
        updateUser,
        initialState as any
    )
    const [hideErrors, setHideErrors] = useState<any>({})
    const [verified, setVerified] = useState(user?.verified || false)
    const [phoneVerified, setPhoneVerified] = useState(
        user?.phoneVerified || false
    )
    useEffect(() => {
        if (isPending || !state.ok) return
        if (state.ok) {
            toast.success(
                <ToastContent
                    message={t('messages.successfullyUpdated')}
                    success
                />,
                {
                    ...(toastOptions as any),
                }
            )
        }
        if (user?.id) router.back()
        else router.push('/customer-management')
    }, [state])

    return (
        <form
            action={action}
            onSubmit={() => setHideErrors({})}
            className='flex flex-col h-full'
        >
            {user && <input type='hidden' name='id' value={user.id} />}
            <div className='w-150 flex items-center px-8 min-h-20 bg-brand-dark'>
                <p className='flex-auto text-lg text-white font-semibold'>
                    {t('title')}
                </p>
                <div
                    className='p-2 cursor-pointer'
                    onClick={() => router.back()}
                >
                    <XIcon className='h-4 w-4 text-white' />
                </div>
            </div>
            <div className='flex flex-col gap-4 flex-auto p-8 overflow-x-auto'>
                <FormInput
                    defaultValue={state?.fields?.firstName || ''}
                    name='firstName'
                    label={t('firstName')}
                    maxLength={45}
                    onFocus={() =>
                        setHideErrors((prev: any) => ({
                            ...prev,
                            firstName: true,
                        }))
                    }
                    error={
                        !(hideErrors.firstName || isPending) &&
                        state?.errors?.firstName
                            ? t(`errors.${state?.errors?.firstName}`, {
                                  field: t('firstName'),
                              })
                            : undefined
                    }
                />
                <FormInput
                    defaultValue={state?.fields?.lastName || ''}
                    name='lastName'
                    label={t('lastName')}
                    maxLength={75}
                    onFocus={() =>
                        setHideErrors((prev: any) => ({
                            ...prev,
                            lastName: true,
                        }))
                    }
                    error={
                        !(hideErrors.lastName || isPending) &&
                        state?.errors?.lastName
                            ? t(`errors.${state?.errors?.lastName}`, {
                                  field: t('lastName'),
                              })
                            : undefined
                    }
                />
                <Select
                    name='status'
                    value={state?.fields?.status || 'active'}
                    placeholder={t('status')}
                    label={t('status')}
                    options={[
                        { id: 'active', name: t('active') },
                        { id: 'blocked', name: t('blocked') },
                    ]}
                    onSelect={() => {
                        setHideErrors((prev: any) => ({
                            ...prev,
                            status: true,
                        }))
                    }}
                    error={
                        !(hideErrors.status || isPending) &&
                        state?.errors?.status
                            ? t(`errors.${state?.errors?.status}`, {
                                  field: t('status'),
                              })
                            : undefined
                    }
                />
                <FormInput
                    defaultValue={state?.fields?.email}
                    name='email'
                    label={t('email')}
                    maxLength={75}
                    onFocus={() =>
                        setHideErrors((prev: any) => ({
                            ...prev,
                            email: true,
                        }))
                    }
                    error={
                        !(hideErrors.email || isPending) && state?.errors?.email
                            ? t(`errors.${state?.errors?.email}`, {
                                  field: t('email'),
                              })
                            : undefined
                    }
                    onChange={() => {
                        setVerified(false)
                    }}
                    verified={verified}
                />
                <PhoneInput
                    value={state?.fields?.phone}
                    label={t('phone')}
                    onFocus={() =>
                        setHideErrors((prev: any) => ({
                            ...prev,
                            phone: true,
                        }))
                    }
                    error={
                        !(hideErrors.phone || isPending) && state?.errors?.phone
                            ? t(`errors.${state?.errors?.phone}`, {
                                  field: t('phone'),
                              })
                            : undefined
                    }
                    onChange={() => {
                        setPhoneVerified(false)
                    }}
                    verified={phoneVerified}
                />
            </div>
            <div className='flex items-center p-4 justify-end gap-4 border-t border-gray-200'>
                <SecondaryButton
                    onClick={(e: React.MouseEvent) => {
                        e.preventDefault()
                        router.back()
                    }}
                >
                    {t('cancel')}
                </SecondaryButton>
                <SubmitButton type='submit' className='w-fit'>
                    {user ? t('update') : t('submit')}
                </SubmitButton>
            </div>
        </form>
    )
}

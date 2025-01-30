'use client'

import { updateCurrentUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { RoleResponseDto, UserResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { AvatarInput } from '@/shared/ui/AvatarInput'
import FormInput from '@/shared/ui/FormInput'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { ResetPasswordField } from '@/shared/ui/ResetPasswordField'
import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { Select } from '@/shared/ui/Select'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const AccountSettingsForm = ({
    me,
    roles,
}: {
    me: UserResponseDto
    roles: RoleResponseDto[]
}) => {
    const t = useTranslations(`panel.form.operator-management`)
    const initialState = {
        errors: {},
        fields: {
            firstName: me?.firstName || '',
            lastName: me?.lastName || '',
            email: me?.email || '',
            phone: me?.phone || '',
            status: me?.status || 'active',
            roleId: me?.roleId || Role.STORE_MANAGER,
            avatar: me?.avatar || '',
        },
    }
    const [state, action, isPending] = useActionState(
        updateCurrentUser,
        initialState as any
    )
    const [hideErrors, setHideErrors] = useState<any>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        if (isSubmitted && state?.ok && !isPending) {
            toast.success(<ToastContent message={t('success')} success />, {
                ...(toastOptions as any),
            })
            setIsSubmitted(false)
        }
    }, [isSubmitted, state?.ok, isPending])
    return (
        <form
            action={action}
            onSubmit={() => {
                setHideErrors({})
                setIsSubmitted(true)
            }}
            className='flex flex-col h-full w-100'
        >
            <div className='flex flex-col gap-4 flex-auto'>
                <AvatarInput
                    value={state?.fields?.avatar}
                    disabled={me?.roleId !== Role.SUPER_ADMINISTRATOR}
                />
                <Select
                    value={state?.fields?.roleId}
                    name='roleId'
                    label={t('role')}
                    options={roles}
                    disabled
                />
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
                <FormInput
                    defaultValue={state?.fields?.email}
                    name='email'
                    label={t('email')}
                    maxLength={75}
                    disabled={me?.roleId !== Role.SUPER_ADMINISTRATOR}
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
                />
                {me?.roleId === Role.SUPER_ADMINISTRATOR && (
                    <ResetPasswordField />
                )}
            </div>
            <div className='flex items-center p-4 justify-end gap-4'>
                <SecondaryButton type='reset'>{t('cancel')}</SecondaryButton>
                <SubmitButton
                    type='submit'
                    className='w-fit'
                    isLoading={isPending}
                >
                    {me ? t('update') : t('submit')}
                </SubmitButton>
            </div>
        </form>
    )
}

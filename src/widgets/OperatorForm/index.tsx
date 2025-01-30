'use client'

import { addUser, updateUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { UserResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { AvatarInput } from '@/shared/ui/AvatarInput'
import FormInput from '@/shared/ui/FormInput'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { ResetPasswordField } from '@/shared/ui/ResetPasswordField'
import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { Select } from '@/shared/ui/Select'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ToastContent } from '@/shared/ui/toast'
import { DEFAULT_COUNTRY_ID, toastOptions } from '@/shared/utils/constant'
import { XIcon } from '@heroicons/react/outline'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { RoleSpecificFields } from './RoleFields'

export const OperatorForm = ({
    user,
    roleFields,
    mapApiKey,
    defaultRole,
}: {
    user?: UserResponseDto | null
    mapApiKey: string
    roleFields: any
    defaultRole: Role
}) => {
    const t = useTranslations(`panel.form.operator-management`)
    const router = useRouter()
    const initialState = {
        errors: {},
        fields: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            status: user?.status || 'active',
            roleId: user?.roleId || defaultRole,
            countryId: user?.countryId || DEFAULT_COUNTRY_ID,
            storeId: user?.operator?.storeId || null,
            avatar: user?.avatar || null,
            deliveryZoneId: user?.operator?.deliveryZoneId || null,
        },
    }
    const [state, action, isPending] = useActionState(
        user ? updateUser : addUser,
        initialState as any
    )
    const [hideErrors, setHideErrors] = useState<any>({})
    useEffect(() => {
        if (isPending || !state.ok) return
        if (state.ok) {
            toast.success(
                <ToastContent
                    message={t(
                        !user
                            ? 'messages.successfullyCreated'
                            : 'messages.successfullyUpdated'
                    )}
                    success
                />,
                {
                    ...(toastOptions as any),
                }
            )
        }
        if (user?.id) router.back()
        else router.push('/operator-management')
    }, [state])
    return (
        <APIProvider apiKey={mapApiKey}>
            <form
                action={action}
                onSubmit={() => setHideErrors({})}
                className='flex flex-col h-full'
            >
                {user && <input type='hidden' name='id' value={user.id} />}
                <div className='w-150 flex items-center px-8 min-h-20 bg-brand-dark'>
                    <p className='flex-auto text-lg text-white font-semibold'>
                        {t(user ? 'edit' : 'add')}
                    </p>
                    <div
                        className='p-2 cursor-pointer'
                        onClick={() => router.back()}
                    >
                        <XIcon className='h-4 w-4 text-white' />
                    </div>
                </div>
                <div className='flex flex-col gap-4 flex-auto p-8 overflow-x-auto'>
                    <Select
                        name='status'
                        value={state?.fields?.status}
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
                                ? t(`errors.${state?.errors?.status}`)
                                : undefined
                        }
                    />
                    <RoleSpecificFields
                        fields={state?.fields}
                        errors={state.errors}
                        hideErrors={hideErrors}
                        setHideErrors={setHideErrors}
                        {...roleFields}
                        onSelect={() => {
                            setHideErrors((prev: any) => ({
                                ...prev,
                                roleId: true,
                            }))
                        }}
                        isPending={isPending}
                    />
                    <FormInput
                        defaultValue={state?.fields?.firstName}
                        name='firstName'
                        maxLength={45}
                        label={t('firstName')}
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
                        defaultValue={state?.fields?.lastName}
                        name='lastName'
                        maxLength={75}
                        label={t('lastName')}
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
                        maxLength={75}
                        label={t('email')}
                        onFocus={() =>
                            setHideErrors((prev: any) => ({
                                ...prev,
                                email: true,
                            }))
                        }
                        error={
                            !(hideErrors.email || isPending) &&
                            state?.errors?.email
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
                            !(hideErrors.phone || isPending) &&
                            state?.errors?.phone
                                ? t(`errors.${state?.errors?.phone}`, {
                                      field: t('phone'),
                                  })
                                : undefined
                        }
                    />
                    <AvatarInput value={state?.fields?.avatar} />
                    {user?.id && <ResetPasswordField id={user?.id} />}
                </div>
                <div className='flex items-center p-4 justify-end gap-4 border-t border-gray-200'>
                    <SecondaryButton
                        onClick={e => {
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
        </APIProvider>
    )
}

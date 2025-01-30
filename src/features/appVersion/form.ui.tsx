'use client'

import { updateVersions } from '@/actions/version'
import FormInput from '@/shared/ui/FormInput'
import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const AppVersionForm = ({
    versionFields,
}: {
    versionFields: {
        customerAppAndroid?: string
        customerAppIos?: string
        operatorAppAndroid?: string
        operatorAppIos?: string
    }
}) => {
    const t = useTranslations('panel.app-version-management')
    const initialState = {
        fields: versionFields,
        errors: {},
    }
    const [state, action, isPending] = useActionState(
        updateVersions,
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
            className='w-fit'
            action={action}
            onSubmit={() => {
                setHideErrors({})
                setIsSubmitted(true)
            }}
        >
            <div className='flex gap-10'>
                <div className='flex flex-col gap-3 w-100'>
                    <h1 className='text-lg font-bold'>{t('customerApp')}</h1>
                    <FormInput
                        label={t('android')}
                        name='customerAppAndroid'
                        type='text'
                        defaultValue={state?.fields?.customerAppAndroid}
                        onFocus={() =>
                            setHideErrors((prev: any) => ({
                                ...prev,
                                customerAppAndroid: true,
                            }))
                        }
                        error={
                            !(hideErrors.customerAppAndroid || isPending) &&
                            state?.errors?.customerAppAndroid
                                ? t(
                                      `errors.${state?.errors?.customerAppAndroid}`,
                                      {
                                          field: t('customerAppAndroid'),
                                      }
                                  )
                                : undefined
                        }
                    />
                    <FormInput
                        label={t('ios')}
                        name='customerAppIos'
                        type='text'
                        defaultValue={state?.fields?.customerAppIos}
                        onFocus={() =>
                            setHideErrors((prev: any) => ({
                                ...prev,
                                customerAppIos: true,
                            }))
                        }
                        error={
                            !(hideErrors.customerAppIos || isPending) &&
                            state?.errors?.customerAppIos
                                ? t(`errors.${state?.errors?.customerAppIos}`, {
                                      field: t('customerAppIos'),
                                  })
                                : undefined
                        }
                    />
                </div>
                <div className='flex flex-col gap-3 w-100'>
                    <h1 className='text-lg font-bold'>{t('operatorApp')}</h1>
                    <FormInput
                        label={t('android')}
                        name='operatorAppAndroid'
                        type='text'
                        defaultValue={state?.fields?.operatorAppAndroid}
                        onFocus={() =>
                            setHideErrors((prev: any) => ({
                                ...prev,
                                operatorAppAndroid: true,
                            }))
                        }
                        error={
                            !(hideErrors.operatorAppAndroid || isPending) &&
                            state?.errors?.operatorAppAndroid
                                ? t(
                                      `errors.${state?.errors?.operatorAppAndroid}`,
                                      {
                                          field: t('operatorAppAndroid'),
                                      }
                                  )
                                : undefined
                        }
                    />
                    <FormInput
                        label={t('ios')}
                        name='operatorAppIos'
                        type='text'
                        defaultValue={state?.fields?.operatorAppIos}
                        onFocus={() =>
                            setHideErrors((prev: any) => ({
                                ...prev,
                                operatorAppIos: true,
                            }))
                        }
                        error={
                            !(hideErrors.operatorAppIos || isPending) &&
                            state?.errors?.operatorAppIos
                                ? t(`errors.${state?.errors?.operatorAppIos}`, {
                                      field: t('operatorAppIos'),
                                  })
                                : undefined
                        }
                    />
                </div>
            </div>
            <div className='flex items-center py-4 justify-end gap-4'>
                <SecondaryButton type='reset'>{t('cancel')}</SecondaryButton>
                <SubmitButton
                    type='submit'
                    className='w-fit'
                    isLoading={isPending}
                >
                    {t('submit')}
                </SubmitButton>
            </div>
        </form>
    )
}

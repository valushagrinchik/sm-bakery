'use client'

import { updateCountryQuery } from '@/actions/country'
import { AssigneeList } from '@/entities/users/ui/AssigneeList.ui'
import { CountryResponseDto, EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { editCountrySchema } from '@/shared/schema/countries'
import { FormState } from '@/shared/types/form'
import { FormLayout, Select } from '@/shared/ui'
import FormInput from '@/shared/ui/FormInput'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { submitForm } from '@/shared/utils/formSubmit'
import { sortStringsAsc } from '@/shared/utils/sort'
import { validateBySchema } from '@/shared/utils/validateBySchema'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

export const CountriesForm = ({
    id,
    data,
}: {
    id: number
    data: CountryResponseDto
}) => {
    const disabled = true
    const router = useRouter()
    const t = useTranslations(`panel.countries.form.edit`)

    const [country, setCountry] = useState(data)

    const update = updateCountryQuery.bind(null, id)
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

    const [state, action] = useActionState<FormState, FormData>(update, {
        fields: {
            ...data,
        },
    })

    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.success == undefined) {
            return
        }
        if (state?.errors) {
            setErrors(errors => ({ ...errors, ...state?.errors }))
            return
        }

        if (state.success) {
            toast.success(
                <ToastContent
                    message={t('messages.successfullyUpdated')}
                    success
                />,
                {
                    ...(toastOptions as any),
                }
            )
            if (country?.id) {
                router.back()
            } else {
                router.push('/countries')
            }
        }
    }, [state])

    const validateRequiredFields = () => {
        const errorResponse = validateBySchema(editCountrySchema, country)

        if (errorResponse) {
            setErrors(errorResponse)
            return false
        }

        return true
    }

    const handleSubmitForm = () => {
        const valid = validateRequiredFields()
        if (!valid) {
            return
        }

        submitForm(formRef)
    }

    return (
        <FormLayout
            className='w-[600px]'
            fit={false}
            title={t('title')}
            disabled={disabled}
            onSubmit={handleSubmitForm}
            onCancel={() => {
                router.back()
            }}
        >
            <form ref={formRef} action={action}>
                <div className='flex flex-col gap-4 flex-auto p-4'>
                    <p className='font-semibold text-base'>
                        {t('generalInfo')}
                    </p>
                    <FormInput
                        value={country.name}
                        type='text'
                        name='name'
                        onClick={() => setErrors({})}
                        label={t('fields.name')}
                        error={
                            errors.name &&
                            t(`errors.${errors.name}`, {
                                field: t('fields.name'),
                            })
                        }
                        disabled={disabled}
                        onChange={e =>
                            setCountry(country => ({
                                ...country,
                                name: e.target.value,
                            }))
                        }
                    />
                    <div className='flex flex-col gap-1 w-full'>
                        <FormInput
                            value={country.inventoryId}
                            type='text'
                            name='inventoryId'
                            onClick={() => setErrors({})}
                            label={t('fields.inventoryId')}
                            error={
                                errors.inventoryId &&
                                t(`errors.${errors.inventoryId}`, {
                                    field: t('fields.inventoryId'),
                                    max: 36,
                                })
                            }
                            disabled={disabled}
                            onChange={e =>
                                setCountry(country => ({
                                    ...country,
                                    inventoryId: e.target.value,
                                }))
                            }
                        />

                        <div className='text-gray-600 text-sm font-normal leading-tight'>
                            {t('messages.inventoryId')}
                        </div>
                    </div>
                    <Select
                        name='status'
                        label={t('fields.status')}
                        value={country.status}
                        disabled={disabled}
                        options={Object.values(EntityStatus).map(status => ({
                            id: status,
                            name: t('options.status.' + status),
                        }))}
                        error={
                            errors.status &&
                            t(`errors.${errors.status}`, {
                                field: t('fields.status'),
                            })
                        }
                        onChange={selected =>
                            setCountry(country => ({
                                ...country,
                                status: selected.id as EntityStatus,
                            }))
                        }
                    />

                    <div className='flex gap-4'>
                        <FormInput
                            name='code'
                            value={country.code}
                            onClick={() => setErrors({})}
                            label={t('fields.code')}
                            error={
                                errors.code &&
                                t(`errors.${errors.code}`, {
                                    field: t('fields.code'),
                                })
                            }
                            disabled={disabled}
                            onChange={e =>
                                setCountry(country => ({
                                    ...country,
                                    code: e.target.value,
                                }))
                            }
                        />
                        <FormInput
                            name='currency'
                            value={country.currency}
                            onClick={() => setErrors({})}
                            label={t('fields.currency')}
                            error={
                                errors.currency &&
                                t(`errors.${errors.currency}`, {
                                    field: t('fields.currency'),
                                })
                            }
                            disabled={disabled}
                            onChange={e =>
                                setCountry(country => ({
                                    ...country,
                                    currency: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <FormInput
                        name='phoneCode'
                        onClick={() => setErrors({})}
                        label={t('fields.phoneCode')}
                        error={
                            errors.phoneCode &&
                            t(`errors.${errors.phoneCode}`, {
                                field: t('fields.phoneCode'),
                            })
                        }
                        disabled={disabled}
                        value={country?.phoneCode}
                        onChange={e =>
                            setCountry(country => ({
                                ...country,
                                phoneCode: e.target.value,
                            }))
                        }
                    />
                    <p className='font-semibold text-base'>{t('managers')}</p>
                    {data.operators?.length ? (
                        <AssigneeList
                            data={data.operators.sort((a, b) =>
                                sortStringsAsc(
                                    a.status! + a.firstName + a.lastName,
                                    b.status! + b.firstName + b.lastName
                                )
                            )}
                            link={`/countries/operators/[id]`}
                            onClick={() => {}}
                        />
                    ) : (
                        <div className='text-gray-600 text-sm font-normal leading-tight'>
                            {t('messages.noManagersAssigned')}
                        </div>
                    )}
                </div>
            </form>
        </FormLayout>
    )
}

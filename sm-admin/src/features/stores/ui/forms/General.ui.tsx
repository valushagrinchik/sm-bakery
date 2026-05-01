import { Store, useStoresContext } from '@/entities/stores/provider'
import { AssigneeList } from '@/entities/users/ui'
import { useDataSnapshot } from '@/shared/hooks/useDataSnapshot'
import {
    CountryResponseDto,
    DeliveryZoneResponseDto,
    EntityStatus,
    StoresResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { Block, FormLayout, Select } from '@/shared/ui'
import { ConfigurationButton } from '@/shared/ui/ConfigurationButtion.ui'
import FormInput from '@/shared/ui/FormInput'
import { PhoneInput } from '@/shared/ui/PhoneInput'
import { ToastContent } from '@/shared/ui/toast'
import {
    CREATE_STORE_FIELDS,
    toastOptions,
    WEEKDAYS,
} from '@/shared/utils/constant'
import { submitForm } from '@/shared/utils/formSubmit'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { omit, pick } from 'lodash'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useActionState, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useStoreGeneralForm } from '../../hooks/useStoreGeneralForm.hook'
import {
    GeneralFormConfirmationModal,
    GeneralFormConfirmationModalType,
} from '../GeneralFormConfirmationModal.ui'
import { FormSteps } from './types'

type GeneralFormProps = {
    id: string
    originalData: Partial<StoresResponseDto>
    additionalResources: {
        countries: CountryResponseDto[]
        deliveryZonesPolygons: DeliveryZoneResponseDto[]
    }
    onStepChange: (
        step: FormSteps,
        data?: { deliveryZonesPolygons: DeliveryZoneResponseDto[] }
    ) => void
    onCountryChange: (state: any, data: FormData) => Promise<any>
}

export const GeneralForm = ({
    id,
    additionalResources,
    originalData,
    onStepChange,
    onCountryChange,
}: GeneralFormProps) => {
    const isNewForm = id == 'new'
    const t = useTranslations('panel.form.stores')
    const formRef = useRef<HTMLFormElement>(null)

    const router = useRouter()

    const [confirmationModal, setConfirmationModal] =
        useState<GeneralFormConfirmationModalType>()

    const { storeDataSnapshot, deleteDataSnapshot, getDataSnapshot } =
        useDataSnapshot('store_' + id)

    const store: Store = {
        ...useStoresContext(s => s.store),
        ...getDataSnapshot(),
    }
    const setStore = useStoresContext(s => s.setStore)

    const { isPending, action, handleSubmitForm, errors, setErrors } =
        useStoreGeneralForm({
            formRef,
            id,
            store,
            // on after server action processing
            onSubmitSuccess: () => {
                toast.success(
                    <ToastContent
                        message={t(
                            isNewForm
                                ? 'messages.successfullyCreated'
                                : 'messages.successfullyUpdated'
                        )}
                        success
                    />,
                    {
                        ...(toastOptions as any),
                    }
                )
                if (store?.id) {
                    router.back()
                } else {
                    router.push('/stores')
                    return
                }
            },
            isConfirmationNeeded: () => {
                if (!isNewForm && originalData.status != store.status) {
                    setConfirmationModal(
                        store.status == EntityStatus.Active
                            ? GeneralFormConfirmationModalType.statusChangedToActive
                            : GeneralFormConfirmationModalType.statusChangedToInactive
                    )
                    return true
                }
                return false
            },
        })

    const isWorkingHoursDefined = WEEKDAYS.find(
        day => store.storeTimeWork && (store.storeTimeWork as any)[day]
    )

    const changeCountryRef = useRef<HTMLFormElement>(null)
    const [
        onCountryChangeState,
        onCountryChangeAction,
        onCountryChangeIsPending,
    ] = useActionState<
        { deliveryZonesPolygons: DeliveryZoneResponseDto[] },
        FormData
    >(onCountryChange, {
        deliveryZonesPolygons: additionalResources.deliveryZonesPolygons,
    })

    return (
        <FormLayout
            fit={false}
            className='w-[600px]'
            title={t(!isNewForm ? 'edit' : 'add')}
            disabled={false}
            onSubmitLoading={isPending}
            onSubmit={() => {
                deleteDataSnapshot()
                handleSubmitForm()
            }}
            onCancel={() => {
                deleteDataSnapshot()
                router.back()
            }}
        >
            <form
                ref={formRef}
                action={action}
                onSubmit={() => setErrors({})}
            ></form>

            <div className='flex flex-col h-full overflow-x-auto'>
                <div className='flex flex-col gap-4 flex-auto p-4'>
                    <Block title={t('blocks.generalInfo')}>
                        <>
                            <FormInput
                                defaultValue={store?.name}
                                name='name'
                                label={t('fields.name')}
                                onChange={e =>
                                    setStore({ name: e.target.value })
                                }
                                onFocus={() => setErrors(omit(errors, 'name'))}
                                error={
                                    errors?.name &&
                                    t(`errors.${errors?.name}`, {
                                        field: t('fields.name'),
                                    })
                                }
                            />
                            <div className='flex flex-col gap-1 w-full'>
                                <FormInput
                                    defaultValue={store?.inventoryId}
                                    name='inventoryId'
                                    label={t('fields.inventoryId')}
                                    onChange={e =>
                                        setStore({
                                            inventoryId: e.target.value,
                                        })
                                    }
                                    onFocus={() =>
                                        setErrors(omit(errors, 'inventoryId'))
                                    }
                                    error={
                                        errors?.inventoryId &&
                                        t(`errors.${errors?.inventoryId}`, {
                                            field: t('fields.inventoryId'),
                                        })
                                    }
                                />

                                <div className='text-gray-600 text-sm font-normal leading-tight'>
                                    {t('messages.inventoryId')}
                                </div>
                            </div>
                            <form
                                ref={changeCountryRef}
                                action={onCountryChangeAction}
                                className='w-full'
                            >
                                <Select
                                    name={'countryId'}
                                    label={t('fields.countryId')}
                                    value={store.countryId}
                                    disabled={true}
                                    options={additionalResources.countries.map(
                                        c => ({
                                            id: c.id,
                                            name: c.name,
                                        })
                                    )}
                                    onChange={(selected: any) => {
                                        setStore({ countryId: selected.id })
                                        changeCountryRef.current?.requestSubmit()
                                    }}
                                />
                            </form>
                            <div className='flex flex-col gap-1 w-full'>
                                <Select
                                    name={'status'}
                                    label={t('fields.status')}
                                    value={store.status}
                                    disabled={isNewForm}
                                    options={Object.values(EntityStatus).map(
                                        status => ({
                                            id: status,
                                            name: t('options.status.' + status),
                                        })
                                    )}
                                    onChange={(selected: any) => {
                                        setErrors(
                                            omit(errors, [
                                                // 'minOrderAmount',
                                                // 'maxOrderAmount',
                                                // 'deliveryZoneTimeWork',
                                            ])
                                        )
                                        setStore({ status: selected.id })
                                    }}
                                />
                                {isNewForm && (
                                    <div className='text-gray-600 text-sm font-normal leading-tight'>
                                        {t('messages.inactiveStatusOnCreate')}
                                    </div>
                                )}
                            </div>

                            <PhoneInput
                                name='servicePhone'
                                value={store.servicePhone}
                                label={t('fields.servicePhone')}
                                onFocus={() =>
                                    setErrors(omit(errors, 'servicePhone'))
                                }
                                onChange={e =>
                                    setStore({ servicePhone: e.target.value })
                                }
                                error={
                                    errors?.servicePhone &&
                                    t(`errors.${errors?.servicePhone}`, {
                                        field: t('fields.servicePhone'),
                                    })
                                }
                            />
                            <FormInput
                                defaultValue={store.standardDeliveryTime}
                                name='standardDeliveryTime'
                                label={t('fields.standardDeliveryTime')}
                                onChange={e =>
                                    setStore({
                                        standardDeliveryTime: e.target.value
                                            ? +e.target.value
                                            : undefined,
                                    })
                                }
                                onFocus={() =>
                                    setErrors(
                                        omit(errors, 'standardDeliveryTime')
                                    )
                                }
                                error={
                                    errors?.standardDeliveryTime &&
                                    t(
                                        `errors.${errors?.standardDeliveryTime}`,
                                        {
                                            field: t(
                                                'fields.standardDeliveryTime'
                                            ),
                                            min: 1,
                                            max: 500,
                                        }
                                    )
                                }
                            />
                            <div className='flex flex-col gap-1 w-auto'>
                                <FormInput
                                    defaultValue={store.maxOrderLag}
                                    name='maxOrderLag'
                                    label={t('fields.maxOrderLag')}
                                    onChange={e => {
                                        setStore({
                                            maxOrderLag: e.target.value
                                                ? +e.target.value
                                                : undefined,
                                        })
                                    }}
                                    onFocus={() =>
                                        setErrors(omit(errors, 'maxOrderLag'))
                                    }
                                    error={
                                        errors?.maxOrderLag &&
                                        t(`errors.${errors?.maxOrderLag}`, {
                                            field: t('fields.maxOrderLag'),
                                            min: 1,
                                            max: 500,
                                        })
                                    }
                                />
                                <div className='text-gray-600 text-sm font-normal leading-tight'>
                                    {t('messages.maxOrderLag')}
                                </div>
                            </div>
                        </>
                    </Block>
                    <Block
                        title={t('blocks.storeDeliveryZone')}
                        icon={
                            errors.deliveryZoneId ? (
                                <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                            ) : store.positionLat && store.positionLng ? (
                                <CheckCircleIcon className='text-green-500 w-5 h-5' />
                            ) : (
                                <XCircleIcon className='w-5 h-5' />
                            )
                        }
                    >
                        <>
                            <ConfigurationButton
                                disabled={onCountryChangeIsPending}
                                onClick={() =>
                                    onStepChange(FormSteps.deliveryZone, {
                                        deliveryZonesPolygons:
                                            onCountryChangeState.deliveryZonesPolygons,
                                    })
                                }
                            />
                            {errors.deliveryZoneId && (
                                <p className='text-sm text-gray-500 mt-2'>
                                    {t(`errors.${errors.deliveryZoneId}`, {
                                        field: t('fields.storeDeliveryZone'),
                                    })}
                                </p>
                            )}
                        </>
                    </Block>
                    <Block
                        title={t('blocks.storesTimeWork')}
                        icon={
                            errors.storeTimeWork ? (
                                <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                            ) : isWorkingHoursDefined ? (
                                <CheckCircleIcon className='text-green-500 w-5 h-5' />
                            ) : (
                                <XCircleIcon className='w-5 h-5' />
                            )
                        }
                    >
                        <div>
                            <ConfigurationButton
                                onClick={() =>
                                    onStepChange(FormSteps.workingHours)
                                }
                            />
                            {errors.storeTimeWork && (
                                <p className='text-sm text-gray-500 mt-2'>
                                    {t(`errors.${errors.storeTimeWork}`, {
                                        field: t('fields.storeTimeWork'),
                                    })}
                                </p>
                            )}
                        </div>
                    </Block>
                    {!isNewForm && (
                        <Block title={t('blocks.storeManagers')}>
                            {store.operators?.length ? (
                                <AssigneeList
                                    data={store.operators}
                                    link={`/operator-management/edit/[id]`}
                                    onClick={() => {
                                        storeDataSnapshot(
                                            pick(store, CREATE_STORE_FIELDS)
                                        )
                                    }}
                                />
                            ) : (
                                <div className='text-gray-600 text-sm font-normal leading-tight'>
                                    {t('messages.noStoreManagersAssigned')}
                                </div>
                            )}
                        </Block>
                    )}
                </div>
            </div>
            <GeneralFormConfirmationModal
                type={confirmationModal}
                onCancel={() => setConfirmationModal(undefined)}
                onConfirm={() => submitForm(formRef)}
            />
        </FormLayout>
    )
}

'use client'
import { AssigneeList } from '@/entities/users/ui'
import {
    CountryResponseDto,
    DeliveryZoneResponseDto,
    EntityStatus,
    PolygonDto,
} from '@/shared/lib/sanMartinApi/Api'
import {
    Block,
    ConfirmationModal,
    ConfirmationModalContent,
    FormLayout,
    RadioButton,
    Select,
} from '@/shared/ui'
import FormInput from '@/shared/ui/FormInput'
import {
    DEFAULT_COUNTRY_ID,
    toastOptions,
    WEEKDAYS,
} from '@/shared/utils/constant'
import { useDeliveryZonesPolygons } from '@/widgets/Maps/hooks/useDeliveryZonesPolygons.hook'
import { useDeliveryZonesStores } from '@/widgets/Maps/hooks/useDeliveryZonesStores.hook'
import { PolygonDrawMap } from '@/widgets/Maps/PolygonsDrawMap'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { StoreInfoMarker } from '@/entities/deliveryZones/form/StoreInfoMarker.ui'
import { StoreRadioButtonLabel } from '@/entities/deliveryZones/form/StoreRadioButtonLabel.ui'
import {
    DeliveryZone,
    useDeliveryZoneContext,
} from '@/entities/deliveryZones/provider'
import { useDataSnapshot } from '@/shared/hooks/useDataSnapshot'
import { deliveryZoneSchema } from '@/shared/schema/deliveryZone'
import { ToastContent } from '@/shared/ui/toast'
import { submitForm } from '@/shared/utils/formSubmit'
import { validateBySchema } from '@/shared/utils/validateBySchema'
import { Marker } from '@/widgets/Maps/Marker'
import { containsPoint, isInsideZone } from '@/widgets/Maps/utils'
import { omit, pick } from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { FormSteps } from '../types'
import { useForm } from './useForm.hook'

export const GeneralForm = ({
    id,
    additionalResources,
    originalData,
    onStepChange,
}: {
    id: string
    originalData: Partial<DeliveryZoneResponseDto>
    additionalResources: { countries: CountryResponseDto[] }
    onStepChange: (step: FormSteps) => void
}) => {
    const isNewForm = id == 'new'
    const { countries } = additionalResources
    const router = useRouter()
    const t = useTranslations('panel.form.delivery-zones')
    const [isOpened, setIsOpened] = useState(false)

    const selectedCountry =
        countries.find(c => c.id == DEFAULT_COUNTRY_ID) || countries[0]

    const { storeDataSnapshot, deleteDataSnapshot, getDataSnapshot } =
        useDataSnapshot('deliveryZone_' + id)

    const deliveryZoneState = useDeliveryZoneContext(s => s.deliveryZone)
    const deliveryZoneStorage = getDataSnapshot()

    const deliveryZone: DeliveryZone = {
        countryId: selectedCountry.id,
        ...deliveryZoneState,
        ...deliveryZoneStorage,
        stores: deliveryZoneStorage
            ? (deliveryZoneState?.stores || []).map(store => ({
                  ...store,
                  isMainStore: deliveryZoneStorage?.stores?.find(
                      (s: any) => s.id == store.id
                  )?.isMainStore,
              }))
            : deliveryZoneState?.stores,
    }

    const setDeliveryZone = useDeliveryZoneContext(s => s.setDeliveryZone)

    const isWorkingHoursDefined = WEEKDAYS.find(
        day =>
            deliveryZone.deliveryZoneTimeWork &&
            (deliveryZone.deliveryZoneTimeWork as any)[day]
    )

    const [assignedStores, setAssignedStores] = useState(deliveryZone.stores)
    const { stores } = useDeliveryZonesStores(
        deliveryZone.countryId,
        deliveryZone.id
    )

    const { deliveryZonesPolygons } = useDeliveryZonesPolygons(
        deliveryZone.countryId
    )

    const polygons = useMemo(() => {
        return deliveryZonesPolygons
            .filter(p => p.id !== deliveryZone.id)
            .map(polygon => ({
                ...polygon,
                color: '#6B7280',
                fillColor: '#9d9d9d',
            }))
    }, [deliveryZonesPolygons])

    const activePolygon = useMemo(() => {
        return deliveryZone.deliveryZonePolygon?.length
            ? {
                  id: deliveryZone.id || uuid(),
                  paths: deliveryZone.deliveryZonePolygon || [],
                  color: '#103C76',
                  fillColor: '#103C76',
              }
            : undefined
    }, [deliveryZone])

    const onPoligonChange = useCallback(
        (deliveryZonePolygon: PolygonDto[]) => {
            if (!deliveryZonePolygon.length) {
                return
            }
            setErrors(omit(errors, 'deliveryZonePolygon'))

            const storesInPoligon = stores
                .filter(
                    store =>
                        store.positionLat &&
                        store.positionLng &&
                        containsPoint(
                            new google.maps.Polygon({
                                paths: deliveryZonePolygon,
                            }),
                            new google.maps.LatLng({
                                lat: store.positionLat!,
                                lng: store.positionLng!,
                            })
                        )
                )
                .map(store => ({
                    id: store.id!,
                    name: store.name!,
                    status: store.status! as EntityStatus,
                    isMainStore: false,
                }))

            setAssignedStores(storesInPoligon)
            // update
            setDeliveryZone({
                deliveryZonePolygon,
                stores: storesInPoligon,
            })
        },
        [stores]
    )

    const formRef = useRef<HTMLFormElement>(null)
    const { state, isPending, action } = useForm({
        id,
        deliveryZone,
    })
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

    const validateRequiredFields = () => {
        const errorResponse =
            validateBySchema(deliveryZoneSchema, deliveryZone) || {}
        if (
            deliveryZone.status == EntityStatus.Active &&
            !assignedStores.find(store => store.isMainStore)
        ) {
            errorResponse.mainAssignedStores = 'IS_NOT_EMPTY'
        }

        if (
            deliveryZone.deliveryZonePolygon &&
            deliveryZone.deliverySubZones.length &&
            deliveryZone.deliverySubZones.find(
                subzone =>
                    !isInsideZone(
                        new google.maps.Polygon({
                            paths: subzone.deliveryZonePolygon,
                        }),
                        new google.maps.Polygon({
                            paths: deliveryZone.deliveryZonePolygon,
                        })
                    )
            )
        ) {
            errorResponse.deliverySubZones = 'INVALID'
        }

        if (!!Object.keys(errorResponse).length) {
            setErrors(errorResponse)
            return false
        }

        return true
    }

    useEffect(() => {
        if (!errors?.deliverySubZones) {
            return
        }
        toast.error(
            <ToastContent message={t('messages.invalidDeliverySubZones')} />,
            {
                ...(toastOptions as any),
            }
        )
        setErrors(omit(errors, 'deliverySubZones'))
    }, [errors?.deliverySubZones])

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
            if (deliveryZone?.id) {
                router.back()
            } else {
                router.push('/delivery-zones')
                return
            }
        }
    }, [state])

    return (
        <FormLayout
            fit={false}
            className='w-[600px]'
            title={t(!isNewForm ? 'edit' : 'add')}
            disabled={false}
            onSubmitLoading={isPending}
            onSubmit={() => {
                const valid = validateRequiredFields()
                if (!valid) {
                    return
                }
                if (!isNewForm && originalData.status != deliveryZone.status) {
                    setIsOpened(true)
                    return
                }
                submitForm(formRef)
                deleteDataSnapshot()
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
                className='flex flex-col h-full overflow-x-auto'
            >
                <div className='flex flex-col gap-4 flex-auto p-4'>
                    <Block title={t('blocks.generalInfo')}>
                        <>
                            <FormInput
                                defaultValue={state?.fields?.name}
                                name='name'
                                label={t('fields.name')}
                                onChange={e =>
                                    setDeliveryZone({ name: e.target.value })
                                }
                                onFocus={() => setErrors(omit(errors, 'name'))}
                                error={
                                    errors?.name &&
                                    t(`errors.${errors?.name}`, {
                                        field: t('fields.name'),
                                    })
                                }
                            />
                            <Select
                                name={'countryId'}
                                label={t('fields.countryId')}
                                value={state?.fields?.countryId}
                                disabled={true}
                                options={countries.map(c => ({
                                    id: c.id.toString(),
                                    name: c.name,
                                }))}
                                onChange={(selected: any) =>
                                    setDeliveryZone({ countryId: selected.id })
                                }
                            />
                            <div className='flex flex-col gap-1 w-full'>
                                <Select
                                    name={'status'}
                                    label={t('fields.status')}
                                    value={state?.fields?.status}
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
                                                'minOrderAmount',
                                                'maxOrderAmount',
                                                'deliveryZoneTimeWork',
                                            ])
                                        )
                                        setDeliveryZone({ status: selected.id })
                                    }}
                                />
                                {isNewForm && (
                                    <div className='text-gray-600 text-sm font-normal leading-tight'>
                                        {t('messages.inactiveStatusOnCreate')}
                                    </div>
                                )}
                            </div>
                            <FormInput
                                defaultValue={state?.fields?.minOrderAmount}
                                name='minOrderAmount'
                                onlyNumbers
                                label={t('fields.minOrderAmount')}
                                iconRight={
                                    <div className='p-4 text-gray-500 text-sm'>
                                        {selectedCountry.currency}
                                    </div>
                                }
                                onChange={e =>
                                    setDeliveryZone({
                                        minOrderAmount: +e.target.value,
                                    })
                                }
                                onFocus={() =>
                                    setErrors(omit(errors, 'minOrderAmount'))
                                }
                                error={
                                    errors.minOrderAmount &&
                                    t(`errors.${errors.minOrderAmount}`, {
                                        field: t('fields.minOrderAmount'),
                                        min: 1,
                                        max: 1000,
                                    })
                                }
                            />
                            <FormInput
                                defaultValue={state?.fields?.maxOrderAmount}
                                name='maxOrderAmount'
                                label={t('fields.maxOrderAmount')}
                                onlyNumbers
                                iconRight={
                                    <div className='p-4 text-gray-500 text-sm'>
                                        {selectedCountry.currency}
                                    </div>
                                }
                                onChange={e =>
                                    setDeliveryZone({
                                        maxOrderAmount: +e.target.value,
                                    })
                                }
                                onFocus={() =>
                                    setErrors(omit(errors, 'maxOrderAmount'))
                                }
                                error={
                                    errors.maxOrderAmount &&
                                    t(`errors.${errors.maxOrderAmount}`, {
                                        field: t('fields.maxOrderAmount'),
                                        min: 100,
                                        max: 5000,
                                    })
                                }
                            />
                        </>
                    </Block>
                    <Block
                        title={t('blocks.map.title')}
                        subtitle={t('blocks.map.subtitle')}
                        icon={
                            errors.deliveryZonePolygon && (
                                <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                            )
                        }
                    >
                        <div className='w-full'>
                            <div className='w-full h-[335px]'>
                                <PolygonDrawMap
                                    id='DZ_MAP'
                                    onPoligonChange={onPoligonChange}
                                    className='w-full h-[335px]'
                                    defaultZoom={11}
                                    polygons={polygons}
                                    activePolygon={activePolygon}
                                    disableDefaultUI
                                    zoomControl
                                    fullscreenControl
                                >
                                    {stores
                                        .filter(
                                            store =>
                                                store.positionLat &&
                                                store.positionLng
                                        )
                                        .map(store => (
                                            <Marker
                                                key={store.id}
                                                position={{
                                                    lat: store.positionLat!,
                                                    lng: store.positionLng!,
                                                }}
                                                content={
                                                    <StoreInfoMarker
                                                        store={{
                                                            ...store,
                                                            status: store.status!,
                                                            isMainStore:
                                                                (store
                                                                    .storeDeliveryZone
                                                                    ?.deliveryZoneId &&
                                                                    store
                                                                        .storeDeliveryZone
                                                                        .deliveryZone
                                                                        .id ==
                                                                        deliveryZone.id &&
                                                                    store
                                                                        .storeDeliveryZone
                                                                        .isMainStore) ||
                                                                false,
                                                        }}
                                                    />
                                                }
                                            />
                                        ))}
                                </PolygonDrawMap>
                            </div>
                            {errors.deliveryZonePolygon && (
                                <p className='text-sm text-gray-500 mt-2'>
                                    {t(`errors.${errors.deliveryZonePolygon}`, {
                                        field: t('fields.deliveryZonePolygon'),
                                    })}
                                </p>
                            )}
                        </div>
                    </Block>

                    <Block
                        title={t('blocks.workingHours')}
                        icon={
                            errors.deliveryZoneTimeWork ? (
                                <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                            ) : isWorkingHoursDefined ? (
                                <CheckCircleIcon className='text-green-500 w-5 h-5' />
                            ) : (
                                <XCircleIcon className='w-5 h-5' />
                            )
                        }
                    >
                        <>
                            <div
                                onClick={() =>
                                    onStepChange(FormSteps.workingHours)
                                }
                                className='cursor-pointer  pl-[15px] pr-[17px] py-[9px] bg-blue-50 rounded-lg justify-center items-center gap-2 inline-flex'
                            >
                                <div className='text-[#28548f] text-sm font-medium leading-tight'>
                                    {t('buttons.configure')}
                                </div>
                            </div>
                            {errors.deliveryZoneTimeWork && (
                                <p className='text-sm text-gray-500 mt-2'>
                                    {t(
                                        `errors.${errors.deliveryZoneTimeWork}`,
                                        {
                                            field: t(
                                                'fields.deliveryZoneTimeWork'
                                            ),
                                        }
                                    )}
                                </p>
                            )}
                        </>
                    </Block>

                    <Block
                        title={t('blocks.subzones')}
                        subtitle={t('messages.inactiveSubzones')}
                        icon={
                            deliveryZone.deliverySubZones?.length ? (
                                <CheckCircleIcon className='text-green-500 w-5 h-5' />
                            ) : (
                                <XCircleIcon className='w-5 h-5' />
                            )
                        }
                    >
                        <div
                            onClick={() => {
                                if (!deliveryZone.deliveryZonePolygon.length) {
                                    return
                                }
                                onStepChange(FormSteps.subzones)
                            }}
                            className={`pl-[15px] pr-[17px] py-[9px] ${deliveryZone.deliveryZonePolygon.length ? 'bg-blue-50 cursor-pointer text-[#28548f]' : 'bg-gray-50 text-gray-600'} rounded-lg justify-center items-center gap-2 inline-flex`}
                        >
                            <div className=' text-sm font-medium leading-tight'>
                                {t('buttons.configure')}
                            </div>
                        </div>
                    </Block>

                    <Block
                        title={t('blocks.assignedStores.title')}
                        subtitle={
                            !!assignedStores.length
                                ? t('blocks.assignedStores.subtitle')
                                : ''
                        }
                        icon={
                            errors.mainAssignedStores && (
                                <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                            )
                        }
                    >
                        <div>
                            {!!assignedStores.length ? (
                                <RadioButton
                                    onChange={id => {
                                        setErrors(
                                            omit(errors, ['mainAssignedStores'])
                                        )
                                        const newStoresState =
                                            assignedStores.map(store => ({
                                                ...store,
                                                isMainStore:
                                                    store.id!.toString() == id,
                                            }))

                                        setAssignedStores(newStoresState)
                                        setDeliveryZone({
                                            stores: newStoresState,
                                        })
                                    }}
                                    checked={assignedStores
                                        .find(store => store.isMainStore)
                                        ?.id!.toString()}
                                    options={assignedStores.map(store => ({
                                        label: (
                                            <StoreRadioButtonLabel
                                                store={store}
                                            />
                                        ),
                                        value: store.id!.toString(),
                                    }))}
                                />
                            ) : (
                                <div className='text-gray-600 text-sm font-normal leading-tight'>
                                    {t('messages.noAssignedStores')}
                                </div>
                            )}
                            {errors.mainAssignedStores && (
                                <div className='text-gray-600 text-sm font-normal leading-tight'>
                                    {t('messages.noMainAssignedStore')}
                                </div>
                            )}
                        </div>
                    </Block>

                    {!isNewForm && (
                        <Block title={t('blocks.deliveryMen')}>
                            {deliveryZone.operators?.length ? (
                                <AssigneeList
                                    data={deliveryZone.operators}
                                    link={`/operator-management/edit/[id]`}
                                    onClick={() => {
                                        storeDataSnapshot(deliveryZone)
                                    }}
                                />
                            ) : (
                                <div className='text-gray-600 text-sm font-normal leading-tight'>
                                    {t('messages.noDeliveryMenAssigned')}
                                </div>
                            )}
                        </Block>
                    )}
                </div>
            </form>
            {isOpened && (
                <ConfirmationModal onClickOutside={() => setIsOpened(false)}>
                    {deliveryZone.status == EntityStatus.Active &&
                    deliveryZone.stores.find(store => store.isMainStore) &&
                    deliveryZone.stores.find(store => store.isMainStore)
                        ?.status != EntityStatus.Active ? (
                        <ConfirmationModalContent
                            title={t(`modal.inactivestore.title`)}
                            subtitle={t(`modal.inactivestore.subtitle`)}
                            buttons={{
                                cancel: {
                                    label: t('buttons.cancel'),
                                    onClick: () => setIsOpened(false),
                                },
                                confirm: {
                                    label: t('buttons.gotothestore'),
                                    onClick: () => {
                                        storeDataSnapshot(
                                            pick(deliveryZone, [
                                                'name',
                                                'countryId',
                                                'status',
                                                'minOrderAmount',
                                                'maxOrderAmount',
                                                'deliveryZonePolygon',
                                                'stores',
                                            ])
                                        )
                                        router.push(
                                            '/stores/edit/' +
                                                deliveryZone.stores.find(
                                                    store => store.isMainStore
                                                )?.id
                                        )
                                    },
                                },
                            }}
                        />
                    ) : (
                        <ConfirmationModalContent
                            title={t(`modal.${deliveryZone.status}.title`)}
                            subtitle={t(
                                `modal.${deliveryZone.status}.subtitle`
                            )}
                            buttons={{
                                cancel: {
                                    label: t('buttons.cancel'),
                                    onClick: () => setIsOpened(false),
                                },
                                confirm: {
                                    label: t('buttons.confirm'),
                                    onClick: () => submitForm(formRef),
                                },
                            }}
                        />
                    )}
                </ConfirmationModal>
            )}
        </FormLayout>
    )
}

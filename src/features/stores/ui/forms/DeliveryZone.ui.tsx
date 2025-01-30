import { Store, useStoresContext } from '@/entities/stores/provider'
import {
    DeliveryZoneResponseDto,
    PolygonDto,
    StoresResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { FormLayout, Select } from '@/shared/ui'
import FormInput from '@/shared/ui/FormInput'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { containsPoint } from '@/widgets/Maps/utils'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { omit } from 'lodash'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useStoreAddressAndDeliveryZoneForm } from '../../hooks/useStoreAddressAndDeliveryZoneForm.hook'
import {
    DeliveryZoneFormConfirmationModal,
    DeliveryZoneFormConfirmationModalType,
} from '../DeliveryZoneFormConfirmationModal.ui'
import { DeliveryZoneMap } from '../DeliveryZoneMap.ui'

export const DeliveryZoneForm = ({
    id,
    onCancel,
    onSave,
    deliveryZonesPolygons,
}: {
    id: string
    originalData: Partial<StoresResponseDto>
    onCancel: () => void
    onSave: () => void
    deliveryZonesPolygons: DeliveryZoneResponseDto[]
}) => {
    const isNewForm = id == 'new'
    const t = useTranslations(`panel.form.stores`)
    const formRef = useRef<HTMLFormElement>(null)

    const store = useStoresContext(s => s.store)
    const setStore = useStoresContext(s => s.setStore)

    const geocoder = new google.maps.Geocoder()

    const [addressAndDeliveryZone, setAddressAndDeliveryZone] = useState<
        Pick<
            Store,
            | 'address'
            | 'positionLat'
            | 'positionLng'
            | 'deliveryZoneId'
            | 'isMainStore'
        >
    >({
        address: store?.address,
        positionLat: store?.positionLat,
        positionLng: store?.positionLng,
        deliveryZoneId: store?.deliveryZoneId,
        isMainStore: store?.isMainStore,
    })

    const deliveryZone = deliveryZonesPolygons.find(
        zone => zone.id == addressAndDeliveryZone?.deliveryZoneId
    )

    const [confirmationModal, setConfirmationModal] =
        useState<DeliveryZoneFormConfirmationModalType>()

    const saveChangesToState = (data: Partial<Store>) => setStore(data)

    const {
        isPending,
        action,
        handleSubmitForm,
        rawSubmitForm,
        errors,
        setErrors,
    } = useStoreAddressAndDeliveryZoneForm({
        formRef,
        id,
        addressAndDeliveryZone,
        saveChangesToState,
        onSubmitSuccess: () => {
            if (!isNewForm) {
                toast.success(
                    <ToastContent
                        message={t(
                            'messages.addressAndDeliveryZoneSuccessfullyUpdated'
                        )}
                        success
                    />,
                    {
                        ...(toastOptions as any),
                    }
                )
            }

            onSave()
        },
        isConfirmationNeeded: () => {
            // set as secondary store of delivery zone
            if (
                !addressAndDeliveryZone.isMainStore &&
                addressAndDeliveryZone.deliveryZoneId ==
                    store?.deliveryZoneId &&
                store?.isMainStore &&
                // check if there are another stores in selected delivery zone
                deliveryZone?.storeDeliveryZones?.length &&
                deliveryZone?.storeDeliveryZones?.length > 1
            ) {
                setConfirmationModal(
                    DeliveryZoneFormConfirmationModalType.selectNewMainStore
                )
                return true
            }
            // set as main store of delivery zone
            if (
                addressAndDeliveryZone.isMainStore &&
                // check if the main store already set for selected delivery zone
                (deliveryZone?.storeDeliveryZones || []).find(
                    store => store.isMainStore
                )
            ) {
                setConfirmationModal(
                    DeliveryZoneFormConfirmationModalType.setAsMainStore
                )
                return true
            }
            return false
        },
    })

    const polygons = useMemo(() => {
        return deliveryZonesPolygons.map(polygon => ({
            id: polygon.id,
            name: polygon.name,
            paths: polygon.deliveryZonePolygon || [],
            color: '#6B7280',
            fillColor: '#9d9d9d',
        }))
    }, [deliveryZonesPolygons])

    const geocode = async (position: PolygonDto) => {
        const response = await geocoder.geocode({
            location: position,
        })

        if (response.results[0]) {
            return response.results[0].formatted_address
        }
        return ''
    }

    const onPositionChange = useCallback(
        async (position: PolygonDto) => {
            setErrors({})
            const address = await geocode(position)

            const deliveryZone = deliveryZonesPolygons.find(polygon =>
                containsPoint(
                    new google.maps.Polygon({
                        paths: polygon.deliveryZonePolygon || [],
                    }),
                    new google.maps.LatLng(position)
                )
            )

            const isMainStore = !!deliveryZone?.storeDeliveryZones?.find(
                dz => dz.id == store?.id && dz.isMainStore
            )

            setAddressAndDeliveryZone(state => ({
                ...state,
                address,
                positionLat: position.lat,
                positionLng: position.lng,
                deliveryZoneId: deliveryZone?.id,
                isMainStore,
            }))
        },
        [deliveryZonesPolygons, setAddressAndDeliveryZone]
    )

    const storeTypeOptions = [
        {
            id: 'main',
            name: t('options.storeType.main'),
        },
        {
            id: 'secondary',
            name: t('options.storeType.secondary'),
        },
    ]

    useEffect(() => {
        if (!errors.deliveryZonePolygonNotification) {
            return
        }
        toast.error(
            <ToastContent
                message={t('messages.addressAndDeliveryZoneNotSpecified')}
            />,
            {
                ...(toastOptions as any),
            }
        )
        setErrors(errors => ({
            ...errors,
            deliveryZonePolygonNotification: undefined,
        }))
    }, [errors.deliveryZonePolygonNotification])

    const position = useMemo(
        () =>
            addressAndDeliveryZone?.positionLat &&
            addressAndDeliveryZone?.positionLng
                ? {
                      lat: addressAndDeliveryZone.positionLat,
                      lng: addressAndDeliveryZone.positionLng,
                  }
                : null,
        [addressAndDeliveryZone]
    )

    return (
        <FormLayout
            className='w-[672px]'
            title={t('deliveryZone')}
            onSubmitLoading={isPending}
            disabled={false}
            onSubmit={handleSubmitForm}
            onCancel={() => {
                setAddressAndDeliveryZone({})
                onCancel()
            }}
        >
            <form ref={formRef} action={action} onSubmit={() => {}}></form>

            <div className='flex flex-col h-full overflow-x-auto'>
                <div className='flex flex-col gap-4 flex-auto p-4'>
                    <FormInput
                        value={addressAndDeliveryZone?.address || ''}
                        name='address'
                        label={t('fields.address')}
                        onChange={e => {
                            setAddressAndDeliveryZone(state => ({
                                ...state,
                                address: e.target.value,
                            }))
                        }}
                        onFocus={() => setErrors(omit(errors, 'address'))}
                        error={
                            errors?.address &&
                            t(`errors.${errors?.address}`, {
                                field: t('fields.address'),
                            })
                        }
                    />
                    <div>
                        <div className='w-full flex justify-between'>
                            <label className='font-medium text-sm text-gray-700'>
                                {t('addressOnTheMap')}
                            </label>
                            {errors.position && (
                                <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                            )}
                        </div>
                        <div className="h-5 text-gray-700 text-sm font-normal font-['Figtree'] leading-tight">
                            {t('messages.addressOnTheMap')}
                        </div>
                        <div>
                            <DeliveryZoneMap
                                polygons={polygons}
                                position={position}
                                onChange={onPositionChange}
                            />
                            {errors.position && (
                                <p className='text-sm text-gray-500 mt-2'>
                                    {t(`errors.${errors.position}`, {
                                        field: t('fields.position'),
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className='font-medium text-sm text-gray-700'>
                            {t('inDeliveryZone')}
                        </label>
                        <div className="h-5 text-gray-700 text-sm font-normal font-['Figtree'] leading-tight">
                            {deliveryZone?.name
                                ? deliveryZone.name
                                : t('messages.noInDeliveryZone')}
                        </div>
                    </div>
                    <div>
                        <label className='font-medium text-sm text-gray-700'>
                            {t('storeType')}
                        </label>
                        <div className=" text-gray-700 text-sm font-normal font-['Figtree'] leading-tight">
                            {deliveryZone ? (
                                <Select
                                    name={'type'}
                                    value={
                                        addressAndDeliveryZone.isMainStore
                                            ? 'main'
                                            : 'secondary'
                                    }
                                    options={storeTypeOptions}
                                    onChange={(selected: any) => {
                                        setAddressAndDeliveryZone(state => ({
                                            ...state,
                                            isMainStore: selected.id == 'main',
                                        }))
                                    }}
                                />
                            ) : (
                                t('messages.storeType')
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DeliveryZoneFormConfirmationModal
                type={confirmationModal}
                deliveryZone={deliveryZone}
                store={store}
                onCancel={() => setConfirmationModal(undefined)}
                onConfirm={() => rawSubmitForm()}
            />
        </FormLayout>
    )
}

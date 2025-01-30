import { Role } from '@/shared/enums/role'
import { Select } from '@/shared/ui/Select'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useDeliveryZonesPolygons } from '../Maps/hooks/useDeliveryZonesPolygons.hook'
import { GoogleMap } from '../Maps/Map'
import { MapPolygon } from '../Maps/types'

export const RoleSpecificFields = ({
    fields,
    roles,
    countries,
    stores,
    errors,
    hideErrors,
    setHideErrors,
    onSelect,
    isPending,
}: {
    fields: {
        roleId: number | null
        countryId: number
        storeId: number | null
        deliveryZoneId: number | null
    }
    roles: { id: number; name: string }[]
    countries: { id: number; name: string }[]
    stores: { id: number; name: string }[]
    errors: any
    hideErrors: any
    isPending?: boolean
    setHideErrors: (errors: any) => void
    deliveryZonesPolygons: MapPolygon[]
    onSelect: () => void
}) => {
    'use client'

    const [selectedDeliveryZoneId, setSelectedDeliveryZoneId] = useState<
        number | null
    >(fields?.deliveryZoneId)
    const t = useTranslations('panel.form.operator-management')
    const [role, setRole] = useState<number | null>(fields?.roleId)

    const { deliveryZonesPolygons } = useDeliveryZonesPolygons(
        fields?.countryId
    )

    return (
        <>
            <Select
                name='roleId'
                value={fields?.roleId}
                placeholder={t('role')}
                label={t('role')}
                options={roles}
                onClick={() => setHideErrors({ ...hideErrors, roleId: true })}
                onSelect={value => {
                    onSelect()
                    setRole(value as number)
                }}
                error={
                    !(hideErrors.roleId || isPending) && errors?.roleId
                        ? t(`errors.${errors?.roleId}`, {
                              field: t('role'),
                          })
                        : undefined
                }
            />
            {role !== Role.SUPER_ADMINISTRATOR && (
                <Select
                    name='countryId'
                    placeholder={t('country')}
                    label={t('country')}
                    value={fields?.countryId}
                    options={countries}
                    onClick={() =>
                        setHideErrors({ ...hideErrors, countryId: true })
                    }
                    disabled
                    error={
                        !(hideErrors.countryId || isPending) &&
                        errors?.countryId
                            ? t(`errors.${errors?.countryId}`, {
                                  field: t('country'),
                              })
                            : undefined
                    }
                />
            )}
            {role === Role.STORE_MANAGER && (
                <Select
                    name='storeId'
                    value={fields?.storeId}
                    placeholder={t('store')}
                    label={t('store')}
                    options={stores}
                    onClick={() =>
                        setHideErrors({ ...hideErrors, storeId: true })
                    }
                    error={
                        !(hideErrors.storeId || isPending) && errors?.storeId
                            ? t(`errors.${errors?.storeId}`, {
                                  field: t('store'),
                              })
                            : undefined
                    }
                />
            )}
            {role === Role.DELIVERY_MAN && (
                <div className='w-full'>
                    <input
                        type='hidden'
                        defaultValue={selectedDeliveryZoneId || undefined}
                        name='deliveryZoneId'
                    />
                    <GoogleMap
                        id='OPERATOR_FORM'
                        className='w-full h-[335px]'
                        defaultZoom={11}
                        onClick={() =>
                            setHideErrors({
                                ...hideErrors,
                                deliveryZoneId: true,
                            })
                        }
                        polygons={deliveryZonesPolygons.map(polygon => ({
                            ...polygon,
                            paths: [...polygon.paths, { ...polygon.paths[0] }],
                            color:
                                selectedDeliveryZoneId === polygon.id
                                    ? '#103C76'
                                    : '#15AC36',
                            fillColor:
                                selectedDeliveryZoneId === polygon.id
                                    ? '#103C76'
                                    : '#05ff00',
                        }))}
                        onSelect={id => {
                            setSelectedDeliveryZoneId(
                                id === selectedDeliveryZoneId
                                    ? null
                                    : (id as number)
                            )
                            setHideErrors({
                                ...hideErrors,
                                deliveryZoneId: true,
                            })
                        }}
                        disableDefaultUI
                        zoomControl
                        fullscreenControl
                    ></GoogleMap>
                    {!(hideErrors.deliveryZoneId || isPending) &&
                        errors?.deliveryZoneId && (
                            <p className='text-sm text-red-500 mt-2'>
                                {t(`errors.${errors?.deliveryZoneId}`, {
                                    field: t('deliveryZone'),
                                })}
                            </p>
                        )}
                </div>
            )}
        </>
    )
}

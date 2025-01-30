'use client'

import { DeliverySubZone } from '@/entities/deliveryZones/provider'
import {
    DeliverySubZoneTimeWorkCreateDto,
    DeliverySubZoneType,
} from '@/shared/lib/sanMartinApi/Api'
import { Block, Option, Select } from '@/shared/ui'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions, WEEKDAYS } from '@/shared/utils/constant'
import { SubzonePolygonDrawMap } from '@/widgets/Maps/SubzonePolygonsDrawMap'
import { MapPolygon } from '@/widgets/Maps/types'
import {
    CheckCircleIcon,
    TrashIcon,
    XCircleIcon,
} from '@heroicons/react/outline'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'

export const SubzoneForm = ({
    subzone,
    otherSubzones,
    onTimeworkConfigurationOpen,
    onChange,
    errors,
    setErrors,
    deliveryZonePolygon,
    onDelete,
    deliveryZoneTimeworkDefined,
}: {
    otherSubzones: DeliverySubZone[]
    deliveryZonePolygon: MapPolygon
    subzone: DeliverySubZone
    errors?: Record<string, string>
    setErrors: (key: string, value: any) => void
    deliveryZoneTimeworkDefined: boolean
    onTimeworkConfigurationOpen: () => void
    onDelete: () => void
    onChange: (subzone: DeliverySubZone) => void
}) => {
    const t = useTranslations(`panel.form.delivery-zones`)
    const isWorkingHoursDefined = WEEKDAYS.find(
        day =>
            (subzone.deliverySubZoneTimeWork || {})[
                day as keyof DeliverySubZoneTimeWorkCreateDto
            ]
    )
    const options = useMemo(
        () =>
            Object.values(DeliverySubZoneType).map(type => ({
                id: type,
                name: t('options.deliverySubZoneType.' + type),
            })),
        []
    )

    const polygons = useMemo(() => {
        return otherSubzones
            .filter(p => p.id !== subzone.id)
            .map(subzone => ({
                id: 'polygon_' + subzone.id!,
                paths: subzone.deliveryZonePolygon || [],
                color: '#DC2626',
                fillColor: '#FF000033',
            }))
    }, [otherSubzones, subzone])
    const activePolygon = useMemo(() => {
        return subzone.id && subzone.deliveryZonePolygon?.length
            ? {
                  id: subzone.id.toString(),
                  paths: subzone.deliveryZonePolygon || [],
                  color: '#103C76',
                  fillColor: '#103C76',
              }
            : undefined
    }, [subzone])

    useEffect(() => {
        if (!errors?.deliveryZonePolygonNotification) {
            return
        }
        toast.error(
            <ToastContent
                message={t('messages.deliveryZonePolygonNotSpecified')}
            />,
            {
                ...(toastOptions as any),
            }
        )
        setErrors('deliveryZonePolygonNotification', undefined)
    }, [errors?.deliveryZonePolygonNotification])

    return (
        <div className='border-b border-gray-200 pb-4 w-full'>
            <div className='flex-col justify-start items-start gap-4 inline-flex w-full'>
                <div className='flex w-full items-center justify-between cursor-pointer'>
                    <span>
                        {t('subzone.label')}{' '}
                        {typeof subzone.id == 'number' ? subzone.id : 'new'}
                    </span>
                    <TrashIcon
                        className='h-4 w-4 text-gray-900'
                        onClick={onDelete}
                    />
                </div>

                <Block
                    title={t('subzone.title')}
                    subtitle={t('subzone.subtitle')}
                    icon={
                        errors?.deliveryZonePolygon && (
                            <ExclamationCircleIcon className='text-red-500 w-5 h-5' />
                        )
                    }
                >
                    <div className='w-full'>
                        <div className='h-[335px]'>
                            <SubzonePolygonDrawMap
                                id={'DZ_MAP_' + subzone.id}
                                onPoligonChange={deliveryZonePolygon => {
                                    onChange({
                                        ...subzone,
                                        deliveryZonePolygon,
                                    })
                                }}
                                className='w-full h-[335px]'
                                defaultZoom={11}
                                polygons={polygons}
                                zonePolygon={deliveryZonePolygon}
                                activePolygon={activePolygon}
                                disableDefaultUI
                                zoomControl
                                fullscreenControl
                            />
                        </div>

                        {errors?.deliveryZonePolygon && (
                            <p className='text-sm text-gray-500 mt-2'>
                                {t(`errors.${errors?.deliveryZonePolygon}`, {
                                    field: t('fields.deliverySubZonePolygon'),
                                })}
                            </p>
                        )}
                    </div>
                </Block>

                <Select
                    name={'type'}
                    label={'Type'}
                    value={subzone.type}
                    options={options}
                    onChange={(selected: Option) => {
                        onChange({
                            ...subzone,
                            type: selected.id as DeliverySubZoneType,
                        })
                    }}
                />

                {subzone.type == DeliverySubZoneType.RestrictedHours && (
                    <Block
                        title={t('blocks.workingHours')}
                        subtitle={t('messages.inactiveSubzoneTimework')}
                        icon={
                            isWorkingHoursDefined ? (
                                <CheckCircleIcon className='text-green-500 w-5 h-5' />
                            ) : (
                                <XCircleIcon className='w-5 h-5' />
                            )
                        }
                    >
                        <div
                            onClick={() => {
                                if (!deliveryZoneTimeworkDefined) {
                                    return
                                }
                                onTimeworkConfigurationOpen()
                            }}
                            className={` pl-[15px] pr-[17px] py-[9px] ${deliveryZoneTimeworkDefined ? 'bg-blue-50 cursor-pointer text-[#28548f]' : 'bg-gray-50 text-gray-600'}  rounded-lg justify-center items-center gap-2 inline-flex`}
                        >
                            <div className='text-sm font-medium leading-tight'>
                                {t('buttons.configure')}
                            </div>
                        </div>
                    </Block>
                )}
            </div>
        </div>
    )
}

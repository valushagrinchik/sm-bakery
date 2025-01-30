'use client'

import { ClockIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { transformSlotToTime, transformTimeToSlot } from '../utils/timeFormat'
import { Option, Select } from './Select.ui'
import Toggle from './Toggle.ui'

export type DayTimesPeriod = {
    isOpen: boolean
    openTime: string | null
    closeTime: string | null
}

type DayTimesPeriodInner = {
    isOpen: boolean
    openTime: number
    closeTime: number
}
export type DayTimesProps = {
    from?: number
    to?: number
    day: string
    data?: DayTimesPeriod
    disabled?: boolean
    onChange: (data: DayTimesPeriod) => void
    errors?: Record<string, string | undefined>
}
export const DayTimes = ({
    from = 0,
    to = 48,
    day,
    data = {
        isOpen: false,
        openTime: '00:00:00',
        closeTime: '00:00:00',
    },
    onChange,
    disabled,
    errors,
}: DayTimesProps) => {
    const defaultValue = -1
    const options = useMemo(
        () =>
            [...Array(48).keys()].map(key => ({
                id: key.toString(),
                name: transformSlotToTime(key),
            })),
        []
    )

    const [period, setPeriod] = useState<DayTimesPeriodInner>({
        isOpen: data.isOpen,
        openTime: data.openTime
            ? transformTimeToSlot(data.openTime)
            : defaultValue,
        closeTime: data.closeTime
            ? transformTimeToSlot(data.closeTime)
            : defaultValue,
    })
    const openTimeOptions = useMemo(
        () => options.filter(o => +o.id >= from && +o.id <= to),
        [from, to]
    )

    const [closeTimeOptions, setCloseTimeOptions] =
        useState<{ id: string; name: string }[]>(openTimeOptions)

    const t = useTranslations(`panel.form.delivery-zones`)

    const handleChange = (newState: DayTimesPeriodInner) => {
        setPeriod(state => ({ ...state, ...newState }))

        onChange({
            isOpen: newState.isOpen,
            openTime:
                newState.openTime != -1
                    ? transformSlotToTime(newState.openTime)
                    : null,
            closeTime:
                newState.closeTime != -1
                    ? transformSlotToTime(newState.closeTime)
                    : null,
        })
    }

    useEffect(() => {
        if (period.openTime == defaultValue) {
            return
        }
        setCloseTimeOptions(
            openTimeOptions.filter(o => +o.id > period.openTime)
        )
    }, [period.openTime])

    return (
        <div className='grid grid-cols-[200px_minmax(0,_1fr)] gap-4 items-start w-full'>
            <div className='flex items-center justify-between gap-4 h-10'>
                <div className='text-gray-700 text-sm font-medium  leading-tight'>
                    {day}
                </div>
                <div className='justify-end items-center gap-3 flex'>
                    <Toggle
                        disabled={disabled}
                        value={period.isOpen}
                        onChange={enabled => {
                            handleChange({
                                ...period,
                                isOpen: enabled,
                                openTime: enabled ? period['openTime'] : -1,
                                closeTime: enabled ? period['closeTime'] : -1,
                            })
                        }}
                    />
                </div>
            </div>

            <div className='w-full'>
                <div className='items-start flex gap-3'>
                    <Select
                        className='w-[114px]'
                        name={'openTime'}
                        value={period.openTime}
                        disabled={disabled || !period.isOpen}
                        placeholder={t('fields.openTime')}
                        options={openTimeOptions}
                        onChange={(selected: Option) =>
                            handleChange({
                                ...period,
                                openTime: +selected.id,
                            })
                        }
                        icon={
                            <div className='p-2 text-gray-400 text-sm'>
                                <ClockIcon className='w-5 h-5' />
                            </div>
                        }
                        error={
                            errors?.openTime
                                ? t(`errors.${errors?.openTime}`, {
                                      field: t('fields.openTime'),
                                  })
                                : undefined
                        }
                    />

                    <Select
                        className='w-[114px]'
                        name={'closeTime'}
                        value={period.closeTime}
                        disabled={disabled || !period.isOpen}
                        placeholder={t('fields.closeTime')}
                        options={closeTimeOptions}
                        onChange={(selected: Option) =>
                            handleChange({
                                ...period,
                                closeTime: +selected.id,
                            })
                        }
                        icon={
                            <div className='p-2 text-gray-400 text-sm'>
                                <ClockIcon className='w-5 h-5' />
                            </div>
                        }
                        error={
                            errors?.closeTime
                                ? t(`errors.${errors?.closeTime}`, {
                                      field: t('fields.closeTime'),
                                  })
                                : undefined
                        }
                    />
                </div>
                {errors?.time ? (
                    <p className='text-sm text-gray-500 mt-2'>
                        {t(`errors.${errors?.time}`, {
                            field: t('fields.closeTime'),
                        })}
                    </p>
                ) : undefined}
            </div>
        </div>
    )
}

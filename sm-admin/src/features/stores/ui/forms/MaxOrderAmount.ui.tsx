import { StoreTimeWork, useStoresContext } from '@/entities/stores/provider'
import { ListOrderPerHoursDto } from '@/shared/lib/sanMartinApi/Api'
import { FormLayout } from '@/shared/ui'
import FormInput from '@/shared/ui/FormInput'
import { ToastContent } from '@/shared/ui/toast'
import { DEFAULT_ORDER_AMOUNT, toastOptions } from '@/shared/utils/constant'
import {
    transformSlotToTime,
    transformTimeToSlot,
} from '@/shared/utils/timeFormat'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { chunk, omit } from 'lodash'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useStoreMaxOrderAmountForm } from '../../hooks/useStoreMaxOrderAmountForm.hook'

export const MaxOrderAmountForm = ({
    id,
    onCancel,
    onSave,
    workingHoursDay,
}: {
    id: string
    onCancel: () => void
    onSave: () => void
    workingHoursDay: string
}) => {
    const isNewForm = id == 'new'
    const translationPath = `panel.form.stores.`
    const t = useTranslations()
    const formRef = useRef<HTMLFormElement>(null)

    const store = useStoresContext(s => s.store)!
    const setStore = useStoresContext(s => s.setStore)
    const storeTimeWork = useStoresContext(s => s.storeTimeWork)

    const MIN = 10
    const MAX = 100

    const workingHours = useMemo(
        () =>
            (storeTimeWork &&
                !!storeTimeWork[workingHoursDay as keyof StoreTimeWork] && {
                    from: transformTimeToSlot(
                        (
                            storeTimeWork[
                                (workingHoursDay +
                                    'Open') as keyof StoreTimeWork
                            ] || ''
                        ).toString()
                    ),
                    to: transformTimeToSlot(
                        (
                            storeTimeWork[
                                (workingHoursDay +
                                    'Close') as keyof StoreTimeWork
                            ] || ''
                        ).toString()
                    ),
                }) ||
            undefined,
        [storeTimeWork]
    )

    const calculateStoreAmountsPerHours = useCallback(() => {
        const savedBefore =
            (store?.storeOrderPerHours || []).find(
                data => data.weekName == workingHoursDay
            )?.listOrderPerHours || []
        return (
            (workingHours &&
                [...Array(workingHours.to).keys()]
                    .slice(workingHours.from)
                    .map(slot => {
                        const timePeriod: string = `${transformSlotToTime(slot)}-${transformSlotToTime(slot + 1)}`
                        return {
                            timePeriod,
                            maxOrderAmount:
                                savedBefore.find(
                                    v => v.timePeriod == timePeriod
                                )?.maxOrderAmount || DEFAULT_ORDER_AMOUNT,
                        }
                    })) ||
            []
        )
    }, [workingHours, store?.storeOrderPerHours])

    // main component state
    const [storeAmountsPerHours, setStoreAmountsPerHours] = useState<
        ListOrderPerHoursDto[]
    >(calculateStoreAmountsPerHours())

    useEffect(() => {
        setStoreAmountsPerHours(calculateStoreAmountsPerHours())
    }, [calculateStoreAmountsPerHours])

    if (!workingHours) {
        console.log('working hours is not defined')
        return
    }

    const { isPending, action, handleSubmitForm, errors, setErrors } =
        useStoreMaxOrderAmountForm({
            formRef,
            workingHoursDay,
            id,
            store,
            setStore,
            storeAmountsPerHours,
            onSubmitSuccess: () => {
                if (!isNewForm) {
                    toast.success(
                        <ToastContent
                            message={t(
                                translationPath +
                                    'messages.maxOrderAmountSuccessfullyUpdated'
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
        })

    const setMaxOrderAmount = (timePeriod: string, value: number) => {
        setStoreAmountsPerHours(storeAmountsPerHours =>
            storeAmountsPerHours.map(data =>
                data.timePeriod == timePeriod
                    ? {
                          ...data,
                          maxOrderAmount: value,
                      }
                    : data
            )
        )
    }

    return (
        <FormLayout
            fit={false}
            className='w-[720px]'
            title={t(translationPath + 'maxOrderAmount')}
            disabled={false}
            onSubmit={() => handleSubmitForm()}
            onCancel={() => onCancel()}
            onSubmitLoading={isPending}
        >
            <form
                ref={formRef}
                action={action}
                onSubmit={() => {}}
                className='flex flex-col h-full overflow-x-auto'
            >
                <div className='flex flex-col gap-4 flex-auto p-4'>
                    <div>{t('weekday.' + workingHoursDay)}</div>
                    <div className='grid grid-cols-3 gap-4 -mr-4'>
                        {chunk(
                            storeAmountsPerHours,
                            Math.ceil(storeAmountsPerHours.length / 3)
                        ).map((chunk, index) => {
                            return (
                                <div
                                    className='flex flex-col gap-4 border-r pr-4'
                                    key={`chank_${index}`}
                                >
                                    {chunk.map(item => {
                                        return (
                                            <div
                                                key={item.timePeriod}
                                                className='flex flex-col'
                                            >
                                                <div className='flex gap-4 items-center justify-between'>
                                                    <div className="w-[90px] text-gray-700 text-sm font-medium font-['Figtree'] leading-tight">
                                                        {item.timePeriod}
                                                    </div>

                                                    <div className='w-[80px]'>
                                                        <FormInput
                                                            type='number'
                                                            onlyNumbers
                                                            allowedKeys={[
                                                                'ArrowUp',
                                                                'ArrowDown',
                                                            ]}
                                                            min={MIN}
                                                            max={MAX}
                                                            name={
                                                                item.timePeriod
                                                            }
                                                            value={
                                                                item.maxOrderAmount
                                                            }
                                                            onFocus={() => {
                                                                setErrors(
                                                                    omit(
                                                                        errors,
                                                                        item.timePeriod
                                                                    )
                                                                )
                                                            }}
                                                            iconRight={
                                                                <>
                                                                    <ChevronUpIcon
                                                                        className='w-4 h-4 relative right-2 top-1 cursor-pointer'
                                                                        onClick={() => {
                                                                            setErrors(
                                                                                omit(
                                                                                    errors,
                                                                                    item.timePeriod
                                                                                )
                                                                            )
                                                                            setMaxOrderAmount(
                                                                                item.timePeriod,
                                                                                item.maxOrderAmount +
                                                                                    1 >
                                                                                    MAX
                                                                                    ? item.maxOrderAmount
                                                                                    : item.maxOrderAmount +
                                                                                          1
                                                                            )
                                                                        }}
                                                                    />
                                                                    <ChevronDownIcon
                                                                        className='w-4 h-4 relative right-2 bottom-1 cursor-pointer'
                                                                        onClick={() => {
                                                                            setErrors(
                                                                                omit(
                                                                                    errors,
                                                                                    item.timePeriod
                                                                                )
                                                                            )
                                                                            setMaxOrderAmount(
                                                                                item.timePeriod,
                                                                                item.maxOrderAmount -
                                                                                    1 <
                                                                                    MIN
                                                                                    ? item.maxOrderAmount
                                                                                    : item.maxOrderAmount -
                                                                                          1
                                                                            )
                                                                        }}
                                                                    />
                                                                </>
                                                            }
                                                            onChange={e => {
                                                                // prevents double click on space key
                                                                if (
                                                                    !e.target
                                                                        .value
                                                                ) {
                                                                    return
                                                                }

                                                                setMaxOrderAmount(
                                                                    item.timePeriod,
                                                                    +e.target
                                                                        .value
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {errors[item.timePeriod] && (
                                                    <p className='text-sm text-gray-500 mt-2 text-right'>
                                                        {t(
                                                            translationPath +
                                                                `errors.${errors[item.timePeriod]}`,
                                                            {
                                                                min: 10,
                                                                max: 100,
                                                                field: t(
                                                                    translationPath +
                                                                        'fields.maxOrderAmount'
                                                                ),
                                                            }
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </form>
        </FormLayout>
    )
}

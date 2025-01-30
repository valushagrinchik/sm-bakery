import { FormLayout } from '@/shared/ui'
import { useTranslations } from 'next-intl'

import { StoreTimeWork, useStoresContext } from '@/entities/stores/provider'
import {
    StoreOrderPerHoursDto,
    StoresResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { DayTimesPeriod } from '@/shared/ui/DayTimes.ui'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions, WEEKDAYS } from '@/shared/utils/constant'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import { useStoreWorkingHours } from '../../hooks/useStoreWorkingHours.hook'
import { DayTimesWithAmountBtn } from '../DayTimesWithAmountBtn.ui'
import { FormSteps } from './types'

export const WorkingHoursForm = ({
    id,
    originalData,
    onCancel,
    onSave,
    onStepChange,
}: {
    id: string
    originalData: Partial<StoresResponseDto>
    onCancel: () => void
    onSave: () => void
    onStepChange: (step: FormSteps, data: { day: string }) => void
}) => {
    const isNewForm = id == 'new'
    const t = useTranslations(`panel.form.stores`)
    const formRef = useRef<HTMLFormElement>(null)

    const storeTimeWork = useStoresContext(s => s.storeTimeWork) || {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    }

    const store = useStoresContext(s => s.store)
    const setStore = useStoresContext(s => s.setStore)
    const setStoreTimeWork = useStoresContext(s => s.setStoreTimeWork)

    const { isPending, action, handleSubmitForm, errors, setErrors } =
        useStoreWorkingHours({
            formRef,
            id,
            store,
            initialStateFields: storeTimeWork,
            saveChangesToState: () => setStore({ storeTimeWork }),
            storeTimeWork,
            onSubmitSuccess: () => {
                if (!isNewForm) {
                    toast.success(
                        <ToastContent
                            message={t(
                                'messages.workingHoursSuccessfullyUpdated'
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

    return (
        <FormLayout
            fit={false}
            className='w-[720px]'
            title={t('workingHours')}
            disabled={false}
            onSubmit={() => handleSubmitForm()}
            onSubmitLoading={isPending}
            onCancel={() => {
                setStoreTimeWork(store?.storeTimeWork || {})
                setStore({
                    storeOrderPerHours:
                        originalData?.storeOrderPerHours as StoreOrderPerHoursDto[],
                })
                onCancel()
            }}
        >
            <form
                ref={formRef}
                action={action}
                onSubmit={() => {}}
                className='flex flex-col h-full overflow-x-auto'
            >
                <div className='flex flex-col gap-4 flex-auto p-4'>
                    {WEEKDAYS.map(day => {
                        const isOpenKey = `${day}Open`
                        const isCloseKey = `${day}Close`

                        return (
                            <DayTimesWithAmountBtn
                                key={day}
                                day={t(`weekday.${day}`)}
                                // data={{
                                //     isOpen: true,
                                //     openTime: '00:30',
                                //     closeTime: '02:30',
                                // }}
                                errors={{
                                    openTime:
                                        errors[isOpenKey] ||
                                        (errors[`${day}Time`] && 'FAKE'),
                                    closeTime:
                                        errors[isCloseKey] ||
                                        (errors[`${day}Time`] && 'FAKE'),
                                    time: errors[`${day}Time`],
                                }}
                                data={{
                                    isOpen: !!storeTimeWork[
                                        day as keyof StoreTimeWork
                                    ],
                                    openTime:
                                        storeTimeWork[
                                            isOpenKey as keyof StoreTimeWork
                                        ]?.toString() || null,
                                    closeTime:
                                        storeTimeWork[
                                            isCloseKey as keyof StoreTimeWork
                                        ]?.toString() || null,
                                }}
                                onChange={(period: DayTimesPeriod) => {
                                    setErrors({})
                                    setStoreTimeWork({
                                        [day as keyof StoreTimeWork]:
                                            period.isOpen,
                                        [isOpenKey as keyof StoreTimeWork]:
                                            period.openTime,
                                        [isCloseKey as keyof StoreTimeWork]:
                                            period.closeTime,
                                    })

                                    if (!period.isOpen) {
                                        setStore({
                                            storeOrderPerHours:
                                                store?.storeOrderPerHours?.filter(
                                                    item => item.weekName != day
                                                ),
                                        })
                                    }
                                }}
                                label={t('buttons.setMaxOrderAmount')}
                                onAmountBtnClick={() => {
                                    onStepChange(FormSteps.maxOrderAmount, {
                                        day,
                                    })
                                }}
                            />
                        )
                    })}
                </div>
            </form>
        </FormLayout>
    )
}

import { FormLayout } from '@/shared/ui'
import { useTranslations } from 'next-intl'

import { updateDeliverySubZoneTimeWork } from '@/actions/deliveryZone'
import {
    DeliverySubZone,
    useDeliveryZoneContext,
} from '@/entities/deliveryZones/provider'
import { DeliverySubZoneTimeWorkCreateDto } from '@/shared/lib/sanMartinApi/Api'
import { FormState } from '@/shared/types/form'
import { DayTimes, DayTimesPeriod } from '@/shared/ui/DayTimes.ui'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions, WEEKDAYS } from '@/shared/utils/constant'
import { submitForm } from '@/shared/utils/formSubmit'
import { transformTimeToSlot } from '@/shared/utils/timeFormat'
import { omit } from 'lodash'
import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

// This component works with custom state 'timework' and save to parent zones state through subzoneData.onSave
export const SubzoneWorkingHoursForm = ({
    id,
    onCancel,
    onSave,
    subzone,
}: {
    id: string
    onCancel: () => void
    onSave: () => void
    subzone: DeliverySubZone
}) => {
    const isNewForm = id == 'new'
    const t = useTranslations(`panel.form.delivery-zones`)
    const deliveryZoneTimeWork = (useDeliveryZoneContext(
        s => s.deliveryZone?.deliveryZoneTimeWork
    ) || {}) as any

    const deliverySubZones =
        useDeliveryZoneContext(s => s.deliverySubZones) || []
    const deliverySubZone = deliverySubZones.find(s => s.id == subzone.id)
    const setDeliverySubZones = useDeliveryZoneContext(
        s => s.setDeliverySubZones
    )

    const [timework, setTimework] = useState<DeliverySubZoneTimeWorkCreateDto>({
        // ...(omit(deliveryZoneTimeWork, [
        //     'id',
        //     'deliveryZoneId',
        //     'createdAt',
        //     'updatedAt',
        // ]) as DeliverySubZoneTimeWorkCreateDto),
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        ...Object.fromEntries(
            Object.entries(
                omit(deliverySubZone?.deliverySubZoneTimeWork, [
                    'id',
                    'deliverySubZoneId',
                    'createdAt',
                    'updatedAt',
                ])
            ).map(([key, value]) =>
                typeof value == 'string'
                    ? [key, value.slice(0, 5)]
                    : [key, value]
            )
        ),
    })

    const update = updateDeliverySubZoneTimeWork.bind(null, +id, +subzone.id, {
        ...timework,
    })
    const [state, action, isPending] = useActionState<FormState, FormData>(
        update,
        {
            fields: {
                ...timework,
            },
        }
    )

    useEffect(() => {
        if (state.success == undefined) {
            return
        }
        if (state?.errors) {
            console.log('Form submit errors:', isPending, state, state?.errors)
            return
        }

        if (state.success) {
            if (!isNewForm) {
                toast.success(
                    <ToastContent
                        message={t(
                            'messages.subzoneWorkingHoursSuccessfullyUpdated'
                        )}
                        success
                    />,
                    {
                        ...(toastOptions as any),
                    }
                )
            }
            onSave()
        }
    }, [state])

    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmitForm = () => {
        setDeliverySubZones(
            deliverySubZones.map(deliverySubZone => ({
                ...(deliverySubZone.id == subzone.id
                    ? { ...deliverySubZone, deliverySubZoneTimeWork: timework }
                    : deliverySubZone),
            }))
        )

        if (typeof subzone.id == 'number') {
            submitForm(formRef)
        } else {
            onSave()
        }
    }

    return (
        <FormLayout
            title={t('subzoneWorkingHours')}
            disabled={false}
            onSubmit={() => handleSubmitForm()}
            onCancel={() => {
                setDeliverySubZones(deliverySubZones)
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
                            <DayTimes
                                key={day}
                                day={t(`weekday.${day}`)}
                                disabled={
                                    !deliveryZoneTimeWork[isOpenKey] &&
                                    !deliveryZoneTimeWork[isCloseKey]
                                }
                                from={
                                    deliveryZoneTimeWork[isOpenKey]
                                        ? transformTimeToSlot(
                                              deliveryZoneTimeWork[isOpenKey]
                                          )
                                        : -1
                                }
                                to={
                                    deliveryZoneTimeWork[isCloseKey]
                                        ? transformTimeToSlot(
                                              deliveryZoneTimeWork[isCloseKey]
                                          )
                                        : -1
                                }
                                // data={{
                                //     isOpen: true,
                                //     openTime: '00:30',
                                //     closeTime: '02:30',
                                // }}
                                data={{
                                    isOpen: !!timework[
                                        day as keyof DeliverySubZoneTimeWorkCreateDto
                                    ],
                                    openTime:
                                        timework[
                                            isOpenKey as keyof DeliverySubZoneTimeWorkCreateDto
                                        ]?.toString() || null,
                                    closeTime:
                                        timework[
                                            isCloseKey as keyof DeliverySubZoneTimeWorkCreateDto
                                        ]?.toString() || null,
                                }}
                                onChange={(period: DayTimesPeriod) => {
                                    const deliverySubZoneTimeWork = {
                                        [day as keyof DeliverySubZoneTimeWorkCreateDto]:
                                            period.isOpen,
                                        [isOpenKey as keyof DeliverySubZoneTimeWorkCreateDto]:
                                            period.openTime,
                                        [isCloseKey as keyof DeliverySubZoneTimeWorkCreateDto]:
                                            period.closeTime,
                                    }
                                    setTimework(timework => ({
                                        ...timework,
                                        ...deliverySubZoneTimeWork,
                                    }))
                                }}
                            />
                        )
                    })}
                </div>
            </form>
        </FormLayout>
    )
}

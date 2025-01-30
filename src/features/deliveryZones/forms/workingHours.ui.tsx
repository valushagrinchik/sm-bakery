import { FormLayout } from '@/shared/ui'
import { useTranslations } from 'next-intl'

import {
    updateDeliveryZoneTimeWork,
    updateDeliveryZoneTimeWorkWithSubzonesTimeWorkCorrection,
} from '@/actions/deliveryZone'
import {
    DeliverySubZone,
    DeliveryZoneTimeWork,
    useDeliveryZoneContext,
} from '@/entities/deliveryZones/provider'
import { DeliverySubZoneTimeWorkResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { storeTimeworkSchema } from '@/shared/schema/common'
import { FormState } from '@/shared/types/form'
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal.ui'
import { ConfirmationModalContent } from '@/shared/ui/ConfirmationModalContent.ui'
import { DayTimes, DayTimesPeriod } from '@/shared/ui/DayTimes.ui'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions, WEEKDAYS } from '@/shared/utils/constant'
import { submitForm } from '@/shared/utils/formSubmit'
import { validateBySchema } from '@/shared/utils/validateBySchema'
import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import {
    transformTimeWorkToCreate,
    validateAndCorrectSubzonesTimework,
} from './utils'

export const WorkingHoursForm = ({
    id,
    onCancel,
    onSave,
}: {
    id: string
    onCancel: () => void
    onSave: () => void
}) => {
    const isNewForm = id == 'new'
    const t = useTranslations(`panel.form.delivery-zones`)
    const [isOpened, setIsOpened] = useState(false)

    const [incorrectSubzones, setIncorrectSubzones] = useState<{
        correctedData: DeliverySubZone[]
        incorrectItems: DeliverySubZone[]
    }>({
        correctedData: [],
        incorrectItems: [],
    })

    const deliveryZoneTimeWork = useDeliveryZoneContext(
        s => s.deliveryZoneTimeWork
    ) || {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    }

    const deliveryZone = useDeliveryZoneContext(s => s.deliveryZone)

    const setDeliveryZone = useDeliveryZoneContext(s => s.setDeliveryZone)

    const setDeliverySubZones = useDeliveryZoneContext(
        s => s.setDeliverySubZones
    )

    const setDeliveryZoneTimeWork = useDeliveryZoneContext(
        s => s.setDeliveryZoneTimeWork
    )

    const update = updateDeliveryZoneTimeWork.bind(
        null,
        +id,
        transformTimeWorkToCreate(deliveryZoneTimeWork)
    )
    const updateWithSubzonesCorrection =
        updateDeliveryZoneTimeWorkWithSubzonesTimeWorkCorrection.bind(
            null,
            +id,
            transformTimeWorkToCreate(deliveryZoneTimeWork),
            incorrectSubzones?.correctedData.map(subzone => ({
                deliveryZonePolygon: subzone.deliveryZonePolygon,
                type: subzone.type,
                deliverySubZoneTimeWork: transformTimeWorkToCreate(
                    subzone.deliverySubZoneTimeWork!
                ) as DeliverySubZoneTimeWorkResponseDto,
                id: typeof subzone.id == 'number' ? subzone.id : undefined,
            }))
        )

    const [state, action, isPending] = useActionState<FormState, FormData>(
        incorrectSubzones.correctedData.length
            ? updateWithSubzonesCorrection
            : update,
        {
            fields: {
                ...deliveryZoneTimeWork,
            },
        }
    )
    const [errors, setErrors] = useState<Record<string, string>>({})

    const formRef = useRef<HTMLFormElement>(null)

    const validateRequiredFields = () => {
        const errorResponse = validateBySchema(
            storeTimeworkSchema,
            deliveryZoneTimeWork
        )

        if (errorResponse) {
            setErrors(errorResponse)
            return false
        }

        return true
    }

    const handleSubmitForm = () => {
        setDeliveryZone({ deliveryZoneTimeWork })
        if (!isNewForm) {
            submitForm(formRef)
        } else {
            onSave()
        }
    }
    const submitFormWithSubzoneValidation = () => {
        const valid = validateRequiredFields()
        if (!valid) {
            return
        }

        const incorrectSubzones = validateAndCorrectSubzonesTimework(
            deliveryZoneTimeWork,
            deliveryZone?.deliverySubZones || []
        )
        if (incorrectSubzones.incorrectItems.length) {
            setIncorrectSubzones(incorrectSubzones)
            setIsOpened(true)
            return
        }
        handleSubmitForm()
    }

    const submitFormWithSubzoneCorrection = () => {
        setDeliveryZone({ deliverySubZones: incorrectSubzones.correctedData })
        setDeliverySubZones(incorrectSubzones.correctedData)
        handleSubmitForm()
    }

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
                        message={t('messages.workingHoursSuccessfullyUpdated')}
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

    return (
        <FormLayout
            className='w-auto'
            title={t('workingHours')}
            disabled={false}
            onSubmit={() => submitFormWithSubzoneValidation()}
            onCancel={() => {
                setDeliveryZoneTimeWork(
                    deliveryZone?.deliveryZoneTimeWork || {}
                )
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
                                    isOpen: !!deliveryZoneTimeWork[
                                        day as keyof DeliveryZoneTimeWork
                                    ],
                                    openTime:
                                        deliveryZoneTimeWork[
                                            isOpenKey as keyof DeliveryZoneTimeWork
                                        ]?.toString() || null,
                                    closeTime:
                                        deliveryZoneTimeWork[
                                            isCloseKey as keyof DeliveryZoneTimeWork
                                        ]?.toString() || null,
                                }}
                                onChange={(period: DayTimesPeriod) => {
                                    setErrors({})
                                    setDeliveryZoneTimeWork({
                                        [day as keyof DeliveryZoneTimeWork]:
                                            period.isOpen,
                                        [isOpenKey as keyof DeliveryZoneTimeWork]:
                                            period.openTime,
                                        [isCloseKey as keyof DeliveryZoneTimeWork]:
                                            period.closeTime,
                                    })
                                }}
                            />
                        )
                    })}
                </div>
            </form>
            {isOpened && (
                <ConfirmationModal onClickOutside={() => setIsOpened(false)}>
                    <ConfirmationModalContent
                        title={t('modal.workingHours.title')}
                        subtitle={t('modal.workingHours.subtitle')}
                        buttons={{
                            cancel: {
                                label: t('buttons.cancel'),
                                onClick: () => {
                                    setIsOpened(false)
                                    onCancel()
                                },
                            },
                            confirm: {
                                label: t('buttons.confirm'),
                                onClick: () =>
                                    submitFormWithSubzoneCorrection(),
                            },
                        }}
                    />
                </ConfirmationModal>
            )}
        </FormLayout>
    )
}

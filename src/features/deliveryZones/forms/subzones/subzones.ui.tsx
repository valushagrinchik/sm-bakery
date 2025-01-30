'use client'
import { DeliverySubZone } from '@/entities/deliveryZones/provider'
import { DeliverySubZoneType } from '@/shared/lib/sanMartinApi/Api'
import { deliverySubZonesSchema } from '@/shared/schema/deliveryZone'
import { FormLayout } from '@/shared/ui'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions, WEEKDAYS } from '@/shared/utils/constant'
import { submitForm } from '@/shared/utils/formSubmit'
import { validateBySchema } from '@/shared/utils/validateBySchema'
import { PlusIcon } from '@heroicons/react/outline'
import { omit, pick } from 'lodash'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { SubzoneForm } from '../subzone.ui'
import { FormSteps } from '../types'
import { useForm } from './useForm.hook'
import { useGlobalState } from './useGlobalState.hook'

// This component works with custom state 'zones' and save to global store on save btn click
export const SubzonesForm = ({
    id,
    onCancel,
    onSave,
    onStepChange,
}: {
    id: string
    onCancel: () => void
    onSave: () => void
    onStepChange: (step: FormSteps, subzone: DeliverySubZone) => void
}) => {
    const isNewForm = id == 'new'
    const formRef = useRef<HTMLFormElement>(null)
    const t = useTranslations(`panel.form.delivery-zones`)

    const {
        deliveryZone,
        deliverySubZones,
        deliveryZonePolygon,
        setDeliverySubZones,
        setDeliveryZone,
    } = useGlobalState()

    const [zones, setZones] = useState<DeliverySubZone[]>(
        deliverySubZones || []
    )

    useEffect(() => {
        setDeliverySubZones(zones)
    }, [zones])

    const addSubzone = () => {
        setZones(state => [
            ...state,
            {
                id: uuid(),
                deliveryZonePolygon: [],
                type: DeliverySubZoneType.RestrictedHours,
                deliverySubZoneTimeWork: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                    ...omit(deliveryZone.deliveryZoneTimeWork, [
                        'id',
                        'deliveryZoneId',
                    ]),
                },
            },
        ])
    }

    const updateSubzone = (subzone: DeliverySubZone) => {
        setZones(state => {
            return state.map(zone => (zone.id == subzone.id ? subzone : zone))
        })
    }
    const deleteSubzone = (subzone: DeliverySubZone) => {
        setZones(state => {
            return state.filter(z => z.id != subzone.id)
        })
    }

    const { onAfterFormSubmit, action, state, isPending } = useForm({
        id,
        zones,
    })

    const onTimeworkConfigurationOpen = useCallback(
        (subzone: DeliverySubZone) =>
            onStepChange(FormSteps.subzoneWorkingHours, subzone),
        [zones]
    )

    const [errors, setErrors] = useState<Record<string, string>>({})
    const validateRequiredFields = () => {
        const errorResponse = validateBySchema(deliverySubZonesSchema, zones)

        if (errorResponse) {
            setErrors(errorResponse)
            return false
        }

        return true
    }

    const deliveryZoneTimeworkDefined = useMemo(
        () =>
            !!WEEKDAYS.find(
                day =>
                    deliveryZone.deliveryZoneTimeWork &&
                    (deliveryZone.deliveryZoneTimeWork as any)[day]
            ),
        []
    )

    useEffect(() => {
        if (state.success == undefined) {
            return
        }
        if (state?.errors) {
            setErrors(errors => ({ ...errors, ...state?.errors }))
            return
        }

        if (state.success) {
            if (!isNewForm) {
                toast.success(
                    <ToastContent
                        message={t('messages.subzonesSuccessfullyUpdated')}
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

    const handleSubmitForm = () => {
        const valid = validateRequiredFields()
        if (!valid) {
            return
        }
        // store data to global state
        setDeliveryZone({ ...deliveryZone, deliverySubZones: zones })
        if (!isNewForm) {
            // server submit for edit
            submitForm(formRef)
        } else {
            // close modal for new
            onSave()
        }
    }

    return (
        <FormLayout
            fit={false}
            className='w-[600px]'
            title={t('subzones')}
            disabled={false}
            onSubmitLoading={isPending}
            onSubmit={handleSubmitForm}
            onCancel={() => {
                setDeliverySubZones(deliveryZone.deliverySubZones || [])
                onCancel()
            }}
        >
            <form
                ref={formRef}
                action={action}
                onSubmit={onAfterFormSubmit}
                className='flex flex-col h-full overflow-x-auto'
            >
                <div className='flex flex-col gap-4 flex-auto p-4 justify-start items-start gap-4 inline-flex'>
                    {zones.map((subzone, index) => (
                        <SubzoneForm
                            otherSubzones={zones}
                            errors={Object.fromEntries(
                                Object.entries(
                                    pick(
                                        errors,
                                        ...Object.keys(errors).filter(key =>
                                            key.startsWith(index + '_')
                                        )
                                    )
                                ).map(([key, value]) => [
                                    key.replace(index + '_', ''),
                                    value,
                                ])
                            )}
                            setErrors={(key, value) => {
                                setErrors(errors => ({
                                    ...errors,
                                    [index + '_' + key]: value,
                                }))
                            }}
                            key={subzone.id}
                            subzone={subzone}
                            onChange={updateSubzone}
                            onTimeworkConfigurationOpen={() =>
                                onTimeworkConfigurationOpen(subzone)
                            }
                            deliveryZonePolygon={deliveryZonePolygon}
                            onDelete={() => deleteSubzone(subzone)}
                            deliveryZoneTimeworkDefined={
                                deliveryZoneTimeworkDefined
                            }
                        />
                    ))}

                    <div
                        onClick={addSubzone}
                        className='cursor-pointer  pl-[15px] pr-[17px] py-[9px] bg-blue-50 rounded-lg justify-center items-center gap-2 inline-flex'
                    >
                        <PlusIcon className='h-5 w-5 text-blue-500' />
                        <div className='text-[#28548f] text-sm font-medium leading-tight'>
                            {t('buttons.add')}
                        </div>
                    </div>
                </div>
            </form>
        </FormLayout>
    )
}

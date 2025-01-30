'use client'

import {
    CountryResponseDto,
    DeliverySubZoneResponseDto,
    DeliveryZoneResponseDto,
    EntityStatus,
} from '@/shared/lib/sanMartinApi/Api'
import { useState } from 'react'
import { GeneralForm } from './forms/general/general.ui'
import { SubzonesForm } from './forms/subzones/subzones.ui'
import { FormSteps } from './forms/types'
import { WorkingHoursForm } from './forms/workingHours.ui'

import {
    DeliverySubZone,
    DeliveryZone,
    DeliveryZoneProvider,
} from '@/entities/deliveryZones/provider'
import { APIProvider } from '@vis.gl/react-google-maps'
import { pick } from 'lodash'
import { SubzoneWorkingHoursForm } from './forms/subzoneWorkingHours.ui'

export const DeliveryZonesForm = ({
    id,
    data,
    additionalResources,
    mapApiKey,
}: {
    id: string
    data: Partial<DeliveryZoneResponseDto>
    additionalResources: { countries: CountryResponseDto[] }
    mapApiKey: string
}) => {
    const [step, setStep] = useState(FormSteps.general)

    const [subzone, setSubzone] = useState<DeliverySubZone>()

    const subzonesFormStepChange = (
        step: FormSteps,
        subzone: DeliverySubZone
    ) => {
        setStep(step)
        setSubzone(subzone)
    }

    return (
        <DeliveryZoneProvider
            deliveryZone={{
                // default values for new form
                name: '',
                // countryId:
                status: EntityStatus.Inactive,
                // minOrderAmount: null,
                // maxOrderAmount: null,
                deliveryZonePolygon: [],
                deliveryZoneTimeWork: undefined,
                deliverySubZones: [],
                operators: [],

                // server data for edit form
                ...(data as Partial<DeliveryZone>),
                stores: data.storeDeliveryZones || [],
                maxOrderAmount:
                    data.maxOrderAmount && !!+data.maxOrderAmount
                        ? +data.maxOrderAmount
                        : null,
                minOrderAmount:
                    data.minOrderAmount && !!+data.minOrderAmount
                        ? +data.minOrderAmount
                        : null,
            }}
            deliveryZoneTimeWork={{
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
                ...pick(data.deliveryZoneTimeWork, [
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                    'sunday',
                    'mondayOpen',
                    'mondayClose',
                    'tuesdayOpen',
                    'tuesdayClose',
                    'wednesdayOpen',
                    'wednesdayClose',
                    'thursdayOpen',
                    'thursdayClose',
                    'fridayOpen',
                    'fridayClose',
                    'saturdayOpen',
                    'saturdayClose',
                    'sundayOpen',
                    'sundayClose',
                ]),
            }}
            deliverySubZones={
                (data.deliverySubZones as Required<DeliverySubZoneResponseDto>[]) ||
                []
            }
        >
            <APIProvider apiKey={mapApiKey}>
                {step == FormSteps.general && (
                    <GeneralForm
                        id={id}
                        originalData={data}
                        onStepChange={setStep}
                        additionalResources={additionalResources}
                    />
                )}
                {step == FormSteps.workingHours && (
                    <WorkingHoursForm
                        id={id}
                        onCancel={() => setStep(FormSteps.general)}
                        onSave={() => setStep(FormSteps.general)}
                    />
                )}
                {step == FormSteps.subzones && (
                    <SubzonesForm
                        id={id}
                        onStepChange={subzonesFormStepChange}
                        onCancel={() => setStep(FormSteps.general)}
                        onSave={() => setStep(FormSteps.general)}
                    />
                )}
                {step == FormSteps.subzoneWorkingHours && (
                    <SubzoneWorkingHoursForm
                        id={id}
                        subzone={subzone!}
                        onCancel={() => setStep(FormSteps.subzones)}
                        onSave={() => setStep(FormSteps.subzones)}
                    />
                )}
            </APIProvider>
        </DeliveryZoneProvider>
    )
}

'use client'
import { StoresProvider } from '@/entities/stores/provider'
import {
    CountryResponseDto,
    DeliveryZoneResponseDto,
    StoreOrderPerHoursDto,
    StoresResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { TIMEWORK_KEYS } from '@/shared/utils/constant'
import { APIProvider } from '@vis.gl/react-google-maps'
import { pick } from 'lodash'
import { useState } from 'react'
import { DeliveryZoneForm } from './ui/forms/DeliveryZone.ui'
import { GeneralForm } from './ui/forms/General.ui'
import { MaxOrderAmountForm } from './ui/forms/MaxOrderAmount.ui'
import { FormSteps } from './ui/forms/types'
import { WorkingHoursForm } from './ui/forms/WorkingHours.ui'

export const StoresForm = ({
    id,
    data,
    additionalResources,
    mapApiKey,
    onCountryChange,
}: {
    id: string
    data: Partial<StoresResponseDto>
    additionalResources: {
        countries: CountryResponseDto[]
        deliveryZonesPolygons: DeliveryZoneResponseDto[]
    }
    mapApiKey: string
    onCountryChange: (state: any, data: FormData) => Promise<any>
}) => {
    const [step, setStep] = useState(FormSteps.general)

    const [workingHoursDay, setWorkingHoursDay] = useState<string>()
    const [deliveryZonesPolygons, setDeliveryZonesPolygons] = useState<
        DeliveryZoneResponseDto[]
    >(additionalResources.deliveryZonesPolygons)

    const onStepChange = (
        step: FormSteps,
        data?: {
            day?: string
            deliveryZonesPolygons?: DeliveryZoneResponseDto[]
        }
    ) => {
        setStep(step)
        if (data?.day) {
            setWorkingHoursDay(data.day)
        }
        if (data?.deliveryZonesPolygons) {
            setDeliveryZonesPolygons(data.deliveryZonesPolygons)
        }
    }

    return (
        <StoresProvider
            store={{
                ...data,
                deliveryZoneId: data.storeDeliveryZone?.deliveryZoneId,
                isMainStore: data.storeDeliveryZone?.isMainStore,
                storeTimeWork: data.storesTimeWork,
                storeOrderPerHours:
                    data.storeOrderPerHours as StoreOrderPerHoursDto[],
            }}
            storeTimeWork={{
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
                ...pick(data.storesTimeWork, TIMEWORK_KEYS),
            }}
        >
            <APIProvider apiKey={mapApiKey}>
                {step == FormSteps.general && (
                    <GeneralForm
                        id={id}
                        originalData={data}
                        onStepChange={onStepChange}
                        onCountryChange={onCountryChange}
                        additionalResources={additionalResources}
                    />
                )}
                {step == FormSteps.workingHours && (
                    <WorkingHoursForm
                        id={id}
                        originalData={data}
                        onStepChange={onStepChange}
                        onCancel={() => setStep(FormSteps.general)}
                        onSave={() => setStep(FormSteps.general)}
                    />
                )}
                {step == FormSteps.deliveryZone && (
                    <DeliveryZoneForm
                        id={id}
                        originalData={data}
                        onCancel={() => setStep(FormSteps.general)}
                        onSave={() => setStep(FormSteps.general)}
                        deliveryZonesPolygons={deliveryZonesPolygons}
                    />
                )}
                {step == FormSteps.maxOrderAmount && (
                    <MaxOrderAmountForm
                        id={id}
                        workingHoursDay={workingHoursDay!}
                        onCancel={() => setStep(FormSteps.workingHours)}
                        onSave={() => setStep(FormSteps.workingHours)}
                    />
                )}
            </APIProvider>
        </StoresProvider>
    )
}

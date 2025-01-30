import { updateDeliveryZoneStores } from '@/actions/deliveryZone'
import { Store } from '@/entities/stores/provider'
import { DeliveryZoneResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { setMainStorePayloadSchema } from '@/shared/schema/deliveryZone'
import { FormState } from '@/shared/types/form'
import {
    ConfirmationModal,
    ConfirmationModalContent,
    ConfirmationModalContentProps,
    Select,
} from '@/shared/ui'
import { submitForm } from '@/shared/utils/formSubmit'
import { validateBySchema } from '@/shared/utils/validateBySchema'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useState } from 'react'

export enum DeliveryZoneFormConfirmationModalType {
    selectNewMainStore = 'selectNewMainStore',
    setAsMainStore = 'setAsMainStore',
}

export const DeliveryZoneFormConfirmationModal = ({
    type,
    onConfirm,
    onCancel,
    ...props
}: {
    deliveryZone?: DeliveryZoneResponseDto
    store?: Partial<Store>
    type?: DeliveryZoneFormConfirmationModalType
    onCancel: (type: DeliveryZoneFormConfirmationModalType) => void
    onConfirm: (type: DeliveryZoneFormConfirmationModalType) => void
}) => {
    const t = useTranslations('panel.form.stores')
    const [isOpened, setIsOpened] = useState(!!type)
    useEffect(() => {
        setIsOpened(!!type)
    }, [type])

    const { deliveryZone } = props

    return (
        isOpened && (
            <ConfirmationModal onClickOutside={() => setIsOpened(false)}>
                {type ==
                    DeliveryZoneFormConfirmationModalType.selectNewMainStore && (
                    <SelectNewMainStoreConfirmationModalContent
                        {...props}
                        title={t(`modal.deliveryZone.title`, {
                            deliveryZone: deliveryZone?.name,
                        })}
                        subtitle={t(`modal.deliveryZone.subtitle`)}
                        buttons={{
                            cancel: {
                                label: t('buttons.cancel'),
                                onClick: () => {
                                    setIsOpened(false)
                                    onCancel(type)
                                },
                            },
                            confirm: {
                                label: t('buttons.confirm'),
                                onClick: () => {
                                    setIsOpened(false)
                                    onConfirm(type)
                                },
                            },
                        }}
                    />
                )}
                {type ==
                    DeliveryZoneFormConfirmationModalType.setAsMainStore && (
                    <ConfirmationModalContent
                        title={t(`modal.deliveryZoneMainStore.title`, {
                            deliveryZone: deliveryZone?.name,
                        })}
                        subtitle={t(`modal.deliveryZoneMainStore.subtitle`, {
                            storeName: (
                                deliveryZone?.storeDeliveryZones || []
                            ).find(s => s.isMainStore)?.name,
                        })}
                        buttons={{
                            cancel: {
                                label: t('buttons.cancel'),
                                onClick: () => {
                                    setIsOpened(false)
                                    onCancel(type)
                                },
                            },
                            confirm: {
                                label: t('buttons.confirm'),
                                onClick: () => {
                                    setIsOpened(false)
                                    onConfirm(type)
                                },
                            },
                        }}
                    />
                )}
            </ConfirmationModal>
        )
    )
}

const SelectNewMainStoreConfirmationModalContent = ({
    deliveryZone,
    store,
    ...props
}: ConfirmationModalContentProps & {
    deliveryZone?: DeliveryZoneResponseDto
    store?: Partial<Store>
}) => {
    const t = useTranslations('panel.form.stores')

    const options = (deliveryZone?.storeDeliveryZones || [])
        .filter(s => s.id != store?.id)
        .map(store => ({
            id: store.id!,
            name: store.name!,
        }))

    const [payload, setPayload] = useState({ storeId: undefined })

    const update = updateDeliveryZoneStores.bind(
        null,
        deliveryZone?.id ? +deliveryZone?.id : -1,
        payload
    )
    const formRef = useRef<HTMLFormElement>(null)
    const [state, action, isPending] = useActionState<FormState, FormData>(
        update,
        { errors: {}, fields: {} }
    )

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

    // server action after submit processing
    useEffect(() => {
        if (state.success == undefined) {
            return
        }
        if (state?.errors) {
            console.log(state?.errors)
            return
        }

        if (state.success) {
            props.buttons.confirm.onClick()
        }
    }, [state])

    const validateRequiredFields = () => {
        const errorResponse = validateBySchema(
            setMainStorePayloadSchema,
            payload
        )

        if (errorResponse) {
            setErrors(errorResponse)
            return false
        }

        return true
    }

    const handleSubmitForm = () => {
        const valid = validateRequiredFields()
        if (!valid) {
            return
        }
        submitForm(formRef)
    }
    return (
        <ConfirmationModalContent
            {...props}
            content={
                <div className='pb-4'>
                    <Select
                        name={'isMainStore'}
                        value={''}
                        label={t('modal.deliveryZone.mainStore')}
                        placeholder={t('modal.deliveryZone.storeName')}
                        options={options}
                        onChange={(selected: any) => {
                            setErrors({})
                            setPayload({ storeId: selected.id })
                        }}
                        error={
                            errors.storeId &&
                            t(`errors.${errors.storeId}`, {
                                field: t('fields.storeId'),
                            })
                        }
                    />
                    <form action={action} ref={formRef} />
                </div>
            }
            buttons={{
                ...props.buttons,
                confirm: {
                    ...props.buttons.confirm,
                    isLoading: isPending,
                    onClick: () => {
                        handleSubmitForm()
                    },
                },
            }}
        />
    )
}

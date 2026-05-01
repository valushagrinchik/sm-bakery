import { ConfirmationModal, ConfirmationModalContent } from '@/shared/ui'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export enum GeneralFormConfirmationModalType {
    statusChangedToActive = 'statusChangedToActive',
    statusChangedToInactive = 'statusChangedToInactive',
}

export const GeneralFormConfirmationModal = ({
    type,
    onCancel,
    onConfirm,
}: {
    type?: GeneralFormConfirmationModalType
    onCancel: (type: GeneralFormConfirmationModalType) => void
    onConfirm: (type: GeneralFormConfirmationModalType) => void
}) => {
    const t = useTranslations('panel.form.stores')
    const [isOpened, setIsOpened] = useState(!!type)
    useEffect(() => {
        setIsOpened(!!type)
    }, [type])
    return (
        isOpened && (
            <ConfirmationModal onClickOutside={() => setIsOpened(false)}>
                {type ==
                    GeneralFormConfirmationModalType.statusChangedToActive && (
                    <ConfirmationModalContent
                        title={t(`modal.active.title`)}
                        subtitle={t(`modal.active.subtitle`)}
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
                    GeneralFormConfirmationModalType.statusChangedToInactive && (
                    <ConfirmationModalContent
                        title={t(`modal.inactive.title`)}
                        // lastInTheDeliveryZoneSubtitle
                        subtitle={t(`modal.inactive.subtitle`)}
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

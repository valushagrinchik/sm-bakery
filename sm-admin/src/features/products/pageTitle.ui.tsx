'use client'

import { syncProducts } from '@/actions/product'
import {
    CatalogParsingMessageBody,
    Rooms,
    useSocket,
} from '@/shared/hooks/useSocket.hook'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ToastContent } from '@/shared/ui/toast'
import { toastOptions } from '@/shared/utils/constant'
import { RefreshIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

export const ProductPageTitle = ({
    status,
}: {
    status: CatalogParsingMessageBody
}) => {
    const isSyncServiceAvailable = status.error !== 'TimeoutError'
    const [parsingInProgress, setParsingInProgress] = useState(status.parsing)
    const [showNotification, setShowNotification] = useState(
        !isSyncServiceAvailable
    )
    const notificationType = useRef<string | undefined>(
        !isSyncServiceAvailable ? 'TimeoutError' : undefined
    )

    const t = useTranslations('panel.product-management')

    useEffect(() => {
        if (notificationType.current === undefined || !showNotification) {
            return
        }
        if (notificationType.current == 'inProcess') {
            toast.success(
                <ToastContent success message={t('alerts.syncInProcess')} />,
                toastOptions as any
            )
        }
        if (notificationType.current == 'success') {
            toast.success(
                <ToastContent success message={t('alerts.syncSuccess')} />,
                toastOptions as any
            )
        }
        if (notificationType.current == 'error') {
            toast.success(
                <ToastContent message={t('alerts.syncError')} />,
                toastOptions as any
            )
        }
        if (notificationType.current == 'TimeoutError') {
            toast.success(
                <ToastContent message={t('alerts.timeoutError')} />,
                toastOptions as any
            )
        }
        setShowNotification(false)
    }, [notificationType.current, showNotification])

    useSocket<CatalogParsingMessageBody>(
        Rooms.catalogParsing,
        ({ parsing, error }) => {
            if (!parsing) {
                setShowNotification(true)
            }
            setParsingInProgress(parsing)
            notificationType.current = parsing
                ? 'inProcess'
                : error
                  ? error
                  : 'success'
        }
    )

    const handleSync = () => {
        setParsingInProgress(true)
        notificationType.current = 'inProcess'
        setShowNotification(true)
        syncProducts()
    }

    return (
        <div className='flex w-full mb-6'>
            <h1 className='text-2xl font-bold text-gray-800 flex-auto'>
                {t('title')}
            </h1>
            <SubmitButton
                className='w-fit'
                onClick={handleSync}
                disabled={!isSyncServiceAvailable || parsingInProgress}
            >
                <RefreshIcon
                    className={`h-5 w-5 text-white ${parsingInProgress ? 'animate-spin' : ''}`}
                />
                <p className='font-medium text-sm'>{t('sync')}</p>
            </SubmitButton>
        </div>
    )
}

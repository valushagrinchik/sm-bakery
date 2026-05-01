'use client'

import { logout } from '@/actions/auth'
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal.ui'
import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { LogoutIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PanelNavbarButton } from './PanelNavbarButton'

export const LogoutButton = () => {
    const t = useTranslations('navbar.logout')
    const [isOpened, setIsOpened] = useState(false)

    return (
        <>
            <PanelNavbarButton
                text='logout.button'
                icon={<LogoutIcon className='h-6 w-6 text-white' />}
                onClick={() => setIsOpened(true)}
            />
            {isOpened && (
                <ConfirmationModal onClickOutside={() => setIsOpened(false)}>
                    <h2 className='text-lg font-medium mb-4'>{t('text')}</h2>
                    <div className='flex gap-4 w-full justify-end'>
                        <SecondaryButton
                            className='w-fit'
                            onClick={() => setIsOpened(false)}
                        >
                            {t('cancel')}
                        </SecondaryButton>
                        <SubmitButton
                            className='w-fit'
                            onClick={() => logout()}
                        >
                            {t('confirm')}
                        </SubmitButton>
                    </div>
                </ConfirmationModal>
            )}
        </>
    )
}

'use client'

import { FormModalLayout } from '@/shared/ui/FormModalLayout.ui'
import { XIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function CustomerViewPage() {
    const t = useTranslations('panel.form.customer-management.view')
    const router = useRouter()
    return (
        <FormModalLayout>
            <div className='w-150 flex items-center px-8 min-h-20 bg-brand-dark'>
                <p className='flex-auto text-lg text-white font-semibold'>
                    {t('title')}
                </p>
                <div
                    className='p-2 cursor-pointer'
                    onClick={() => router.back()}
                >
                    <XIcon className='h-4 w-4 text-white' />
                </div>
            </div>
        </FormModalLayout>
    )
}

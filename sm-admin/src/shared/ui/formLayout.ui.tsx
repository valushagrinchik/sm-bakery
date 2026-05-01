'use client'

import { SubmitButton } from '@/shared/ui/SubmitButton'
import { XIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import { FormModalLayout } from './FormModalLayout.ui'

type FormLayoutProps = {
    title: string
    children?: ReactNode
    disabled?: boolean
    onSubmitLoading?: boolean
    onSubmit: () => void
    onCancel: () => void
    className?: string
    fit?: boolean
}
export const FormLayout = ({
    title,
    children,
    disabled = false,
    onSubmitLoading,
    onSubmit,
    onCancel,
    className,
    fit = true,
}: FormLayoutProps) => {
    const t = useTranslations()

    return (
        <FormModalLayout className={className} fit={fit}>
            <div className='flex items-center p-8 h-[80px] bg-brand-dark align-self-start z-15'>
                <p className='flex-auto text-lg text-white'>{title}</p>
                <div className='w-3 cursor-pointer' onClick={onCancel}>
                    <XIcon className='h-4 w-4 text-white' />
                </div>
            </div>
            {children}
            <div className='flex items-center p-4 gap-4 justify-end  mt-auto border-["#E5E7EB"] border-t'>
                <button
                    onClick={onCancel}
                    type='button'
                    className='h-[38px] pl-[15px] pr-[17px] py-[9px] bg-white rounded-lg border border-gray-300 justify-center items-center gap-2 inline-flex'
                >
                    <div className='text-gray-700 text-sm font-medium leading-tight'>
                        {t('buttons.cancel')}
                    </div>
                </button>

                <SubmitButton
                    type='button'
                    disabled={disabled}
                    isLoading={onSubmitLoading}
                    className='w-auto'
                    onClick={onSubmit}
                >
                    {t('buttons.save')}
                </SubmitButton>
            </div>
        </FormModalLayout>
    )
}

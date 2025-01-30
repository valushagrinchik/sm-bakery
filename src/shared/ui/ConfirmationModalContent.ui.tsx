import { SecondaryButton } from '@/shared/ui/SecondaryButton'
import { SubmitButton } from '@/shared/ui/SubmitButton'
import { ReactNode } from 'react'

export type ConfirmationModalContentProps = {
    title: string
    subtitle?: string
    content?: ReactNode
    buttons: {
        cancel: {
            label: string
            onClick: () => void
        }
        confirm: {
            isLoading?: boolean
            label: string
            onClick: () => void
        }
    }
}

export const ConfirmationModalContent = ({
    title,
    subtitle,
    content,
    buttons,
}: ConfirmationModalContentProps) => {
    return (
        <>
            <h2 className='text-lg font-medium mb-4'>{title}</h2>
            {subtitle && (
                <div className='text-gray-500 text-sm font-normal pb-4 leading-tight'>
                    {subtitle}
                </div>
            )}
            {content}
            <div className='flex gap-4 w-full justify-end'>
                <SecondaryButton
                    className='w-fit'
                    onClick={buttons.cancel.onClick}
                >
                    {buttons.cancel.label}
                </SecondaryButton>
                <SubmitButton
                    isLoading={buttons.confirm.isLoading}
                    className='w-fit'
                    onClick={buttons.confirm.onClick}
                >
                    {buttons.confirm.label}
                </SubmitButton>
            </div>
        </>
    )
}

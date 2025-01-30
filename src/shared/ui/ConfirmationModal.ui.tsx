import { ExclamationIcon } from '@heroicons/react/outline'

export const ConfirmationModal = ({
    onClickOutside,
    children,
}: {
    onClickOutside: () => void
    children: React.ReactNode
}) => {
    return (
        <div
            className='fixed h-screen w-screen top-0 left-0 bg-overlay bg-opacity-60   z-50'
            onClick={onClickOutside}
        >
            <div
                className='fixed w-128 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex gap-4 items-start p-6 rounded-lg'
                onClick={e => e.stopPropagation()}
            >
                <div className='p-2 rounded-full bg-red-100'>
                    <ExclamationIcon className='h-6 w-6 text-red-600' />
                </div>
                <div className='flex-auto'>{children}</div>
            </div>
        </div>
    )
}

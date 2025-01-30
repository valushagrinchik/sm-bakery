'use client'

import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { XIcon } from '@heroicons/react/outline'

export const Modal = ({
    title,
    content,
    open = false,
    onClose,
}: {
    title: string
    content: any
    open: boolean
    onClose: () => void
}) => {
    const clickOutsideRef = useClickOutside(onClose)

    return (
        <div
            className={`${open ? 'visible' : 'hidden'} fixed flex inset-0 z-10 w-screen overflow-y-auto bg-brand-gray bg-opacity-60 items-center justify-center`}
        >
            <div
                ref={clickOutsideRef}
                className={`w-[220px] h-60 p-6 bg-white rounded-lg shadow justify-between items-start gap-4 inline-flex absolute `}
            >
                <div className='overflow-x-auto h-full w-full '>
                    <div className='flex-col justify-start items-start gap-4 inline-flex'>
                        <div className='flex-col justify-start items-start gap-2 flex'>
                            <div className='self-stretch text-gray-900 text-lg font-medium leading-normal'>
                                {title}
                            </div>
                            {content}
                        </div>
                    </div>
                </div>
                <div
                    className='absolute end-6 right-6 cursor-pointer'
                    onClick={onClose}
                >
                    <XIcon className='h-5 w-5 text-gray-400' />
                </div>
            </div>
        </div>
    )
}

'use client'

import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { ExclamationCircleIcon, SelectorIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export const Select = ({
    disabled = false,
    label,
    error,
    placeholder,
    value,
    options,
    name,
    onClick,
    onSelect,
}: {
    label?: string
    error?: string
    disabled?: boolean
    placeholder?: string
    value?: any
    name?: string
    options?: {
        id?: string | number
        name?: string
    }[]
    onClick?: () => void
    onSelect?: (value: any) => void
}) => {
    const [isOpened, setIsOpened] = useState(false)
    const [selectedValue, setSelectedValue] = useState<
        string | number | null | undefined
    >(value)
    const clickOutsideRef = useClickOutside(() => setIsOpened(false))
    return (
        <div className='w-full relative' ref={clickOutsideRef}>
            <input
                type='hidden'
                defaultValue={selectedValue as string | number}
                name={name}
            />
            <p className='font-medium text-sm text-gray-700 mb-1'>{label}</p>
            <div
                onClick={() => {
                    if (disabled) {
                        return
                    }
                    if (onClick) onClick()
                    setIsOpened(!isOpened)
                }}
                className={`w-full h-10 px-3 border ${error ? 'border-red-300 text-red-800' : `border-gray-200 ${disabled ? 'text-gray-600' : 'text-gray-900'}`} rounded-lg text-sm flex items-center justify-between relative${disabled ? ' bg-gray-50 cursor-default' : ' bg-white cursor-pointer overflow-hidden'}`}
            >
                <p className='line-clamp-2'>
                    {selectedValue
                        ? options?.find(({ id }) => id === selectedValue)?.name
                        : placeholder}
                </p>
                {!disabled && (
                    <div className='self-center'>
                        <SelectorIcon className='text-gray-400 w-5 h-full' />
                    </div>
                )}
                {!!error && (
                    <>
                        <ExclamationCircleIcon
                            width={20}
                            height={20}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-red-500'
                        />
                    </>
                )}
            </div>
            {!disabled && isOpened && (
                <div className='absolute w-full shadow-lg ring-1 bg-white ring-black ring-opacity-5 rounded-md mt-1 max-h-60 overflow-auto z-20'>
                    {options?.map(({ id, name }) => (
                        <div
                            key={id}
                            className='px-3 py-2 cursor-pointer'
                            onClick={() => {
                                setSelectedValue(id)
                                setIsOpened(false)
                                if (onSelect) onSelect(id)
                            }}
                        >
                            <p className='text-sm text-gray-900'>
                                {name || id}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {error && <p className='text-sm text-gray-500 mt-2'>{error}</p>}
        </div>
    )
}

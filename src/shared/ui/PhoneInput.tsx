'use client'

import { ChevronDownIcon, XCircleIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import { InputHTMLAttributes, KeyboardEvent, useState } from 'react'

export const PhoneInput = ({
    value,
    error,
    label,
    name,
    verified,
    ...props
}: {
    value?: string
    error?: string
    verified?: boolean
    label?: string
} & InputHTMLAttributes<HTMLInputElement>) => {
    const [currentValue, setCurrentValue] = useState(
        value?.replace('+502', '') || ''
    )
    const checkNumber = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            return
        }
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault()
        }
    }

    return (
        <div className='w-full'>
            <label htmlFor={name} className='font-medium text-sm text-gray-700'>
                {label}
            </label>
            <div
                className={`relative w-full border  ${error ? 'text-red-800 border-red-300' : 'text-gray-900 border-gray-200'} rounded-lg text-sm flex items-center justify-center placeholder:text-gray-400`}
            >
                <div
                    className={`flex items-center gap-1 border-r border-gray-200 px-3 py-2 text-gray-500 cursor-not-allowed`}
                >
                    <p>GU</p>
                    <ChevronDownIcon className='h-5 w-5' />
                </div>
                <input
                    {...props}
                    value={`+502` + currentValue}
                    onChange={e => {
                        setCurrentValue(
                            e.target?.value?.length <= 24
                                ? e?.target?.value?.slice(4)
                                : currentValue
                        )
                        if (props.onChange) props.onChange(e)
                    }}
                    type='text'
                    name='phone'
                    maxLength={24}
                    className={`w-full pl-2 h-10 ${error ? 'text-red-800' : 'text-gray-900'} rounded-lg text-sm flex items-center justify-center placeholder:text-gray-400`}
                    onKeyDown={checkNumber}
                />
                {!!error && (
                    <>
                        <ExclamationCircleIcon
                            width={20}
                            height={20}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-red-500'
                        />
                    </>
                )}
                {verified && !error && (
                    <CheckCircleIcon className='h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-green-500' />
                )}
                {!verified && verified !== undefined && !error && (
                    <XCircleIcon className='h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                )}
            </div>
            {error && <p className='text-sm text-gray-500 mt-2'>{error}</p>}
        </div>
    )
}

'use client'

import { EyeIcon, EyeOffIcon, XCircleIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import {
    DetailedHTMLProps,
    forwardRef,
    InputHTMLAttributes,
    KeyboardEvent,
    ReactNode,
    useState,
} from 'react'

const FormInput = forwardRef(function FormInput(
    {
        icon,
        iconRight,
        label,
        error,
        onlyNumbers,
        allowedKeys = ['ArrowUp', 'ArrowDown', 'Backspace', 'Delete'],
        onKeyDown,
        verified,
        ...props
    }: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > & {
        icon?: ReactNode
        iconRight?: ReactNode
        verified?: boolean
        label?: string
        error?: string
        onlyNumbers?: boolean
        allowedKeys?: string[]
        onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
    },
    ref: any
) {
    const [currentType, setCurrentType] = useState<string | undefined>(
        props.type
    )
    const checkNumber = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault()
        }
    }

    const keyDownValidation = (e: KeyboardEvent<HTMLInputElement>) => {
        if (onKeyDown) {
            onKeyDown(e)
        }
    }

    return (
        <div className='w-full select-none'>
            <label
                htmlFor={props.name}
                className='font-medium text-sm text-gray-700'
            >
                {label}
            </label>
            <div className='relative'>
                <div className='absolute top-1/2 -translate-y-1/2 left-2 z-10'>
                    {icon}
                </div>

                <div className='relative'>
                    <input
                        ref={ref}
                        {...props}
                        type={currentType}
                        className={`w-full h-10 ${icon ? 'pl-10' : 'pl-3'} ${props.disabled ? 'disabled:bg-gray-50' : ''} border ${error ? 'border-red-300 text-red-800' : 'border-gray-200 text-gray-900'} rounded-lg text-sm flex items-center justify-center placeholder:text-gray-400 cursor-text`}
                        onKeyDown={
                            onlyNumbers ? checkNumber : keyDownValidation
                        }
                    />
                </div>

                {iconRight && (
                    <div className='absolute top-1/2 -translate-y-1/2 right-0 '>
                        {iconRight}
                    </div>
                )}
                {props.type === 'password' &&
                    !error &&
                    (currentType === 'password' ? (
                        <EyeIcon
                            width={20}
                            height={20}
                            onClick={() => setCurrentType('text')}
                            className='h-6 w-6 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                        />
                    ) : (
                        <EyeOffIcon
                            width={20}
                            height={20}
                            onClick={() => setCurrentType('password')}
                            className='h-6 w-6 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                        />
                    ))}
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
})

export default FormInput

'use client'

import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/outline'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { ReactNode, useEffect, useState } from 'react'

export type Option = {
    id: string | number
    name: string | number
}
export const Select = ({
    label,
    placeholder,
    icon,
    disabled = false,
    value,
    name,
    options,
    error,
    className,
    onChange,
}: {
    label?: string
    icon?: ReactNode
    placeholder?: string
    value?: string | number
    name: string
    disabled?: boolean
    options: Option[]
    error?: string
    className?: string
    onChange: (selected: Option) => void
}) => {
    const selectedOption = options.find(o => o.id == value)
    const [selected, setSelected] = useState(selectedOption)

    useEffect(() => {
        setSelected(options.find(o => o.id == value))
    }, [value])

    return (
        <div className={`w-full ${className}`}>
            <input type='hidden' defaultValue={selected?.id} name={name} />
            <Listbox
                disabled={disabled}
                defaultValue={selected}
                onChange={newSelected => {
                    setSelected(newSelected)
                    onChange(newSelected)
                }}
            >
                <div>
                    {label && (
                        <Label className='block text-sm/6 font-medium text-gray-900 mb-2 '>
                            {label}
                        </Label>
                    )}
                    <div className='relative '>
                        <ListboxButton
                            className={`h-10 relative w-full ${disabled ? 'disabled:bg-gray-50 ' : 'cursor-pointer'} rounded-md py-2 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ${!!error ? 'ring-red-300' : 'ring-gray-200'} focus:outline-none sm:text-sm/6  `}
                        >
                            {selected && (
                                <span className='block truncate '>
                                    {selected.name}
                                </span>
                            )}
                            {placeholder && !selected && (
                                <span className='text-gray-500 text-sm font-normal'>
                                    {placeholder}
                                </span>
                            )}
                            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center'>
                                {!!error ? (
                                    <ExclamationCircleIcon
                                        width={20}
                                        height={20}
                                        className='absolute right-2 top-1/2 -translate-y-1/2 text-red-500'
                                    />
                                ) : (
                                    icon || (
                                        <span className='pr-2'>
                                            <SelectorIcon className='text-gray-400 w-5 h-5' />
                                        </span>
                                    )
                                )}
                            </span>
                        </ListboxButton>

                        <ListboxOptions
                            // transition
                            className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm'
                        >
                            {options.map(o => (
                                <ListboxOption
                                    key={o.id}
                                    value={o}
                                    className='group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-brand-dark data-[focus]:text-white'
                                >
                                    <span className='block truncate font-normal group-data-[selected]:font-semibold'>
                                        {o.name}
                                    </span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </div>
            </Listbox>

            {error?.trim() && (
                <p className='text-sm text-gray-500 mt-2 text-nowrap'>
                    {error}
                </p>
            )}
        </div>
    )
}

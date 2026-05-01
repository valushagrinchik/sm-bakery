'use client'

import { ReactNode, useState } from 'react'

export const RadioButton = ({
    options,
    checked,
    onChange,
}: {
    options: { label: ReactNode; value: string }[]
    checked?: string
    onChange: (checked: string) => void
}) => {
    const [checkedValue, setCheckedValue] = useState(checked)
    return (
        <div className='w-[344px] flex-col justify-start items-start gap-2 inline-flex'>
            {options.map(option => (
                <div
                    className='flex items-center mb-4'
                    key={option.value}
                    onClick={() => {
                        setCheckedValue(option.value)
                        onChange(option.value)
                    }}
                >
                    <div className='w-4 h-5 justify-center items-center inline-flex cursor-pointer '>
                        {checkedValue == option.value ? (
                            <div className='w-4 h-4 relative bg-[#103c76] rounded-lg'>
                                <div className='w-1.5 h-1.5 left-[5px] top-[5px] absolute bg-white rounded-full' />
                            </div>
                        ) : (
                            <div className='w-4 h-4 relative bg-white rounded-lg border border-gray-300' />
                        )}
                    </div>

                    <label className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer'>
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )
}

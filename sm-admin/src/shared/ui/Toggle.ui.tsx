'use client'

import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'

export default function Toggle({
    value = false,
    onChange,
    disabled,
}: {
    value: boolean
    disabled?: boolean
    onChange: (enabled: boolean) => void
}) {
    const [enabled, setEnabled] = useState(value)

    useEffect(() => {
        setEnabled(value)
    }, [value])

    return (
        <>
            <Switch
                disabled={disabled}
                checked={value}
                onChange={() => {
                    setEnabled(!enabled)
                    onChange(!enabled)
                }}
                className='group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 data-[checked]:bg-brand-dark'
            >
                <span className='sr-only'>Use setting</span>
                <span
                    aria-hidden='true'
                    className='pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5'
                />
            </Switch>
            <div className='text-gray-900 text-sm font-medium leading-tight'>
                {enabled ? 'Opened' : 'Closed'}
            </div>
        </>
    )
}

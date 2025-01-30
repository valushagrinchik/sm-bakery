import { Checkbox, CheckboxProps } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { twMerge } from 'tailwind-merge'

export const CheckboxInput = (props: CheckboxProps) => {
    return (
        <Checkbox
            className={twMerge(
                'group size-6 rounded-md bg-white p-1 ring-1 ring-brand-dark/15 ring-inset data-[checked]:bg-brand-dark',
                props.className as string
            )}
            {...props}
        >
            <CheckIcon className='hidden size-4 text-white group-data-[checked]:block' />
        </Checkbox>
    )
}

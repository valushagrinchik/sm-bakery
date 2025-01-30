import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const sizes = {
    xs: {
        text: 'text-xs',
        p: 'px-[0.6875rem] py-[0.4375rem]',
    },
    sm: {
        text: 'text-sm',
        p: 'px-[0.8125rem] py-[0.5625rem]',
    },
    base: {
        text: 'text-base',
        p: 'px-[1.0625rem] py-[0.5625rem]',
    },
    l: {
        text: 'text-l',
        p: 'px-[1.0625rem] py-[0.5625rem]',
    },
    xl: {
        text: 'text-xl',
        p: 'px-[1.5625rem] py-[0.8125rem]',
    },
}

export const SubmitButton = ({
    type,
    onClick,
    children,
    size,
    className,
    disabled,
    isLoading,
}: {
    type?: 'button' | 'reset' | 'submit'
    onClick?: () => void
    className?: string
    disabled?: boolean
    size?: 'xs' | 'sm' | 'base' | 'l' | 'xl'
    isLoading?: boolean
    children?: ReactNode
} & HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            disabled={disabled}
            type={type}
            className={twMerge(
                `w-full h-10 flex justify-center rounded-lg ${isLoading ? 'cursor-wait bg-brand-light' : 'bg-brand-dark active:bg-brand-dark'} hover:bg-brand-light active:outline-brand-dark text-center ${sizes[size || 'base'].text} text-white font-medium gap-2 items-center ${sizes[size || 'base'].p}`,
                className
            )}
            onClick={isLoading ? undefined : onClick}
        >
            {children}
        </button>
    )
}

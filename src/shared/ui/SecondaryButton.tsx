import { ReactNode } from 'react'
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

export const SecondaryButton = ({
    type,
    onClick,
    children,
    size,
    className,
}: {
    type?: 'button' | 'reset' | 'submit'
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    className?: string
    size?: 'xs' | 'sm' | 'base' | 'l' | 'xl'
    children?: ReactNode
}) => {
    return (
        <button
            type={type}
            className={twMerge(
                `w-fit flex justify-center rounded-lg bg-white  hover:bg-gray-50 active:bg-white active:outline-brand-dark text-center ${sizes[size || 'base'].text} text-gray-700 font-medium gap-2 items-center ${sizes[size || 'base'].p} border border-gray-300`,
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

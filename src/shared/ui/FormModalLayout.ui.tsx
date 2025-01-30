import { ReactNode } from 'react'

export const FormModalLayout = ({
    children,
    className,
    fit = true,
}: {
    children: ReactNode
    className?: string
    fit?: boolean
}) => {
    return (
        <div className='fixed h-screen w-screen top-0 left-0 bg-overlay bg-opacity-60 z-20'>
            <div
                className={`${fit ? 'w-fit' : ''} min-w-[600px] fixed h-screen right-0 top-0 bg-white flex flex-col overflow-x-auto justify-between ${className ? className : ''}`}
            >
                {children}
            </div>
        </div>
    )
}

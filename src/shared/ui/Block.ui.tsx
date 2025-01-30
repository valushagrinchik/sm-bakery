import { ReactNode } from 'react'

export const Block = ({
    title,
    subtitle,
    children,
    icon,
}: {
    title: string
    subtitle?: string
    children?: ReactNode
    icon?: ReactNode
}) => {
    return (
        <div className='flex-col justify-start items-start gap-4 inline-flex w-full'>
            <div className='self-stretch justify-between items-center inline-flex'>
                <div className='grow shrink basis-0 flex-col justify-start items-start inline-flex'>
                    <div className='w-full flex justify-between'>
                        <div className='text-gray-700 text-base font-semibold leading-normal'>
                            {title}
                        </div>
                        {icon && (
                            <div className='w-5 justify-center items-center flex'>
                                {icon}
                            </div>
                        )}
                    </div>
                    {subtitle && (
                        <div className='text-gray-700 text-sm font-normal leading-tight'>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    )
}

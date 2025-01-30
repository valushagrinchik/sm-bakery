'use client'

import { ReactNode, useState } from 'react'

export const TextWithTooltip = ({
    content,
    tooltipContent,
    contentClassName = '',
}: {
    content: string | ReactNode
    tooltipContent: string | string | ReactNode
    contentClassName?: string
}) => {
    const [hidden, setHidden] = useState(true)

    return (
        <span
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}
            className='relative text-sm text-center inline'
        >
            {content}
            {!hidden && (
                <div
                    className={`absolute ml-4 z-10 p-3 bg-white rounded-lg shadow justify-start items-start gap-4 inline-flex text-gray-700 text-sm font-medium ${contentClassName}`}
                >
                    {tooltipContent}
                </div>
            )}
        </span>
    )
}

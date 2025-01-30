import {
    ArrowNarrowLeftIcon,
    ArrowNarrowRightIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Fragment } from 'react'

export const Pagination = ({
    page,
    pageCount,
}: {
    page?: number
    pageCount: number
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const getPageLink = (index: string | number) => {
        const newPathname = page
            ? `${pathname.slice(0, pathname.lastIndexOf('/') - pathname.length)}/${index}`
            : `${pathname}/${index}`
        return `${newPathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    }
    const currentPage = page || 1
    const pageSet = new Set([
        1,
        2,
        currentPage - 1 || 1,
        currentPage,
        currentPage + 1 > pageCount ? pageCount : currentPage + 1,
        pageCount - 1 || 1,
        pageCount,
    ])
    const pageArray = Array.from(pageSet)
        .sort((a, b) => a - b)
        .reduce((acc: (number | null)[], value: number) => {
            if (acc.length !== 0 && value - 1 !== acc[acc.length - 1])
                acc.push(null)
            acc.push(value)
            return acc
        }, [])
    return (
        <nav className='flex items-end justify-between border-t border-gray-200 px-4 sm:px-0 -mt-px'>
            <Link
                href={getPageLink(`${currentPage - 1}`)}
                className={`flex gap-3 items-end ${currentPage === 1 ? 'pointer-events-none' : ''} `}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
            >
                <ArrowNarrowLeftIcon className='h-5 w-5 text-gray-400' />
                <p className='text-gray-500 text-sm'>Previous</p>
            </Link>
            <div className='flex'>
                {pageArray.map((value, index) => (
                    <Fragment key={index}>
                        {value ? (
                            <Link
                                key={value}
                                href={getPageLink(`${value}`)}
                                className={`h-10 w-9 flex items-end justify-center text-center align-bottom border-brand-dark ${value === currentPage ? 'border-t-2 pointer-events-none' : ''} `}
                            >
                                <p
                                    className={`text-sm font-medium ${value === currentPage ? 'mt-3.5 text-brand-dark' : 'mt-4 text-gray-500'} `}
                                >
                                    {value}
                                </p>
                            </Link>
                        ) : (
                            <div
                                className={`h-10 w-9 flex items-end justify-center text-center align-bottom border-brand-dark`}
                            >
                                <p
                                    className={`text-sm font-medium mt-4 text-gray-500 cursor-default`}
                                >
                                    ...
                                </p>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
            <Link
                href={getPageLink(`${currentPage + 1}`)}
                className={`flex gap-3 items-end ${currentPage === pageCount ? 'pointer-events-none' : ''} `}
                aria-disabled={currentPage === pageCount}
                tabIndex={currentPage === pageCount ? -1 : undefined}
            >
                <p className='text-gray-500 text-sm'>Next</p>
                <ArrowNarrowRightIcon className='h-5 w-5 text-gray-400' />
            </Link>
        </nav>
    )
}

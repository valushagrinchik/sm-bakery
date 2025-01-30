import { EyeIcon, PencilIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

export type TableProps<T> = {
    fields: (keyof T)[]
    items: ({ id?: number; edit?: boolean } & {
        [P in keyof T]?: T[P] | ReactNode
    })[]
    pagename: string
    edit?: boolean
    view?: boolean
}

export function Table<T extends { id?: string | number }>({
    fields,
    items,
    pagename,
    edit,
    view,
}: TableProps<T>) {
    const t = useTranslations(`panel.${pagename}.fields`)

    const searchParams = useSearchParams()
    const urlSearchParams = Object.fromEntries(searchParams.entries())

    return (
        <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-900'>
                <thead className='text-xs text-gray-500'>
                    <tr>
                        {fields.map(field => (
                            <th
                                key={field as string}
                                scope='col'
                                className='px-6 py-3 uppercase font-medium tracking-wider'
                            >
                                {t(field)}
                            </th>
                        ))}
                        {(edit || view) && (
                            <th
                                scope='col'
                                className='px-6 py-3 uppercase font-medium tracking-wider text-center'
                            >
                                {t('actions')}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {items.length ? (
                        items.map(item => (
                            <tr className='bg-white border-b' key={item?.id}>
                                {fields.map(field => (
                                    <td
                                        key={field as string}
                                        className={`px-6 ${field === 'id' ? 'text-gray-500 py-4' : ''}`}
                                    >
                                        {item[field] as string}
                                    </td>
                                ))}
                                {(edit || view) && (
                                    <td
                                        scope='col'
                                        className='px-6 text-center'
                                    >
                                        <div className='flex justify-center items-center gap-1'>
                                            {edit &&
                                                (item?.edit == null ||
                                                    item?.edit) && (
                                                    <Link
                                                        href={{
                                                            pathname: `/${pagename}/edit/${item.id}`,
                                                            query: urlSearchParams,
                                                        }}
                                                        className='p-2'
                                                        scroll={false}
                                                    >
                                                        <PencilIcon className='mx-auto w-4 h-4 text-gray-500' />
                                                    </Link>
                                                )}
                                            {view && (
                                                <Link
                                                    href={{
                                                        pathname: `/${pagename}/view/${item.id}`,
                                                        query: urlSearchParams,
                                                    }}
                                                    scroll={false}
                                                    className='p-2'
                                                >
                                                    <EyeIcon className=' mx-auto w-4 h-4 text-gray-500' />
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr className='bg-white border-b'>
                            <td colSpan={fields.length + 1}>
                                <div className='text-gray-600 text-sm font-normal leading-tight text-center p-4'>
                                    No data
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

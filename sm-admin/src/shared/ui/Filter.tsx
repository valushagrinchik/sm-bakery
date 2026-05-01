'use client'

import FormInput from '@/shared/ui/FormInput'
import { Select } from '@/shared/ui/Select'
import { SearchIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export type FilterProps<T> = {
    fields: {
        label?: string
        name: keyof T
        options: {
            id: string | number
            name: string
        }[]
        hidden?: boolean
    }[]
    values: Partial<T> & { search?: string }
    pagename: string
}

export const Filter = <T extends Record<string, string | number | boolean>>({
    fields,
    pagename,
    values,
}: FilterProps<T>) => {
    const t = useTranslations(`panel.filters`)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(
        (values.search || '').trim().slice(0, 50)
    )

    const onSelect = (name: string, value: string) => {
        if (
            name === 'search' &&
            !value.trim() &&
            !(values[name] && values[name].trim)
        ) {
            setSearch('')
            return
        }
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete(name)
        if (value) newSearchParams.set(name, value)
        const newPathname = `${pathname.slice(0, pathname.lastIndexOf('/') - pathname.length)}`
        router.push(`${newPathname}?${newSearchParams}`)
    }

    return (
        <div className='w-full flex justify-start items-start mb-4 gap-4'>
            <div className='flex-auto flex flex-wrap gap-4'>
                {fields.map(
                    field =>
                        !field.hidden && (
                            <div key={field.name as string} className='w-50'>
                                <Select
                                    label={
                                        field.label || (field.name as string)
                                    }
                                    options={field.options}
                                    placeholder={
                                        field.options.length
                                            ? t('default')
                                            : t('noData')
                                    }
                                    value={values[field.name]}
                                    onSelect={value =>
                                        onSelect(
                                            field.name as string,
                                            value.toString()
                                        )
                                    }
                                    disabled={!field.options.length}
                                />
                            </div>
                        )
                )}
            </div>
            <div className='ml-auto min-w-50 flex-shrink-0'>
                <FormInput
                    value={search}
                    label='&zwnj;'
                    onChange={e => {
                        {
                            const newValue = e.currentTarget.value
                                .toString()
                                .slice(0, 50)

                            setSearch(newValue)
                            onSelect('search', newValue)
                        }
                    }}
                    placeholder={t(`search.${pagename}`)}
                    icon={<SearchIcon className='h-5 w-5 text-gray-400' />}
                />
            </div>
        </div>
    )
}

'use client'

import { setLocale } from '@/actions/locale'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { CheckIcon, ChevronUpIcon, GlobeIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const locales = ['en', 'es']

export const LanguageSelector = ({ locale }: { locale: string }) => {
    const [isVisible, setIsVisible] = useState(false)
    const t = useTranslations('navbar.locale')
    const ref = useClickOutside(() => setIsVisible(false))

    return (
        <div ref={ref} className='relative'>
            <button
                onClick={() => setIsVisible(!isVisible)}
                className={`text-left w-fit mx-2 h-10 ${isVisible ? 'bg-brand-light ' : ''}hover:bg-brand-light flex items-center p-2 pr-3 gap-3 rounded-md cursor-pointer`}
            >
                <GlobeIcon className='text-white min-w-6 h-6' />
                <p
                    className={`uppercase text-white text-sm flex-auto${isVisible ? ' font-semibold' : ''}`}
                >
                    {locale}
                </p>
                <ChevronUpIcon
                    className={`min-w-4 text-white${isVisible ? '' : ' rotate-180'}`}
                />
            </button>
            {isVisible && (
                <div className='absolute bg-brand-light py-1 rounded w-32 left-2 bottom-11'>
                    {locales.map(lc => (
                        <button
                            key={lc}
                            className='w-full flex items-center justify-between pl-3 pr-4 h-9'
                            onClick={() => {
                                setIsVisible(false)
                                setLocale(lc)
                            }}
                        >
                            <p
                                className={`text-white text-left text-sm ${lc === locale ? 'font-semibold ' : ''}flex-auto`}
                            >
                                {t(lc)}
                            </p>
                            {lc === locale && (
                                <CheckIcon className='text-white w-5 h-5' />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

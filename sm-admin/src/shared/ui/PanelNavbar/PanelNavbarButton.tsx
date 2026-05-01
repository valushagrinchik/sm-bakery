'use client'

import { NavbarButtonProps } from '@/shared/types/navbar'
import { ChevronUpIcon } from '@heroicons/react/outline'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

import { PermissionResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { usePathname } from 'next/navigation'

const isLinkActive = (link: string = '', pathname: string) => {
    return link.split('/')[1] == pathname.split('/')[1]
}

const Button = (
    props: NavbarButtonProps & { isOpened?: boolean; isActive?: boolean }
) => {
    const t = useTranslations('navbar')

    return (
        <button
            type='submit'
            onClick={props.onClick}
            className={`text-left w-60 mx-2 h-10 ${props.isActive ? 'bg-brand-light' : ''} hover:bg-brand-light flex items-center p-2 pr-3 gap-3 rounded-md cursor-pointer`}
        >
            {props.icon || <div className='w-6 h-6' />}
            <p
                className={`text-white text-sm flex-auto${props?.isOpened ? ' font-semibold' : ''}`}
            >
                {t(props.text)}
            </p>
            {!!props?.subButtons?.length && (
                <ChevronUpIcon
                    className={`text-white h-4 w-4 ${props.isOpened ? '' : 'rotate-180'}`}
                />
            )}
        </button>
    )
}

export const PanelNavbarButton = (
    props: NavbarButtonProps & {
        permissions?: Partial<PermissionResponseDto>
    }
) => {
    const pathname = usePathname()
    const isActive = !!props?.subButtons?.find(b =>
        isLinkActive(b.link, pathname)
    )
    const [showSubButtons, setShowSubButtons] = useState(isActive)

    if (
        !!props.permission &&
        props.permissions &&
        !props?.permissions[props.permission as keyof PermissionResponseDto]
    )
        return null

    if (props.link)
        return (
            <Link href={props.link}>
                <Button
                    icon={props.icon}
                    text={props.text}
                    isActive={isLinkActive(props.link, pathname)}
                />
            </Link>
        )

    return (
        <>
            <Button
                {...props}
                isOpened={showSubButtons}
                isActive={isActive}
                onClick={
                    !props?.subButtons?.length
                        ? props.onClick
                        : () => setShowSubButtons(!showSubButtons)
                }
            />
            {showSubButtons &&
                props?.subButtons?.map((subButtonProps, index) => (
                    <PanelNavbarButton
                        key={index}
                        {...subButtonProps}
                        permissions={props.permissions}
                    />
                ))}
        </>
    )
}

'use client'

import { Avatar } from '@/shared/icons/Avatar'
import { FetchWrapper } from '@/shared/lib/sanMartinApi/fetchWrapper'
import { ToastContent } from '@/shared/ui/toast'
import { MB, toastOptions } from '@/shared/utils/constant'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { SecondaryButton } from './SecondaryButton'

export const AvatarInput = ({
    value,
    disabled,
}: {
    value?: string
    disabled?: boolean
}) => {
    const t = useTranslations('panel.form.operator-management')
    const [preview, setPreview] = useState<string | null>(value || null)
    const [avatar, setAvatar] = useState<string>(value || '')
    const ref = useRef<HTMLInputElement>(null)

    const cookies = new Cookies()
    const accessToken = cookies.get('access_token')
    const handleImageChange = async (avatar: File) => {
        if (avatar.size > 2 * MB) {
            toast.error(<ToastContent message={t('avatarMaxSize')} />, {
                ...(toastOptions as any),
            })
            return
        }
        const fileReader = new FileReader()
        fileReader.readAsDataURL(avatar as Blob)
        fileReader.addEventListener('load', async () => {
            if (!fileReader.result) return
            const image = new Image()
            image.src = fileReader.result as string
            image.onload = async () => {
                if (image.height !== image.width) {
                    toast.error(
                        <ToastContent message={t('avatarAspectRatio')} />,
                        { ...(toastOptions as any) }
                    )
                    return false
                }
                setPreview(fileReader.result as string)
                const formData = new FormData()
                formData.append('file', avatar)
                const fetchWrapper = new FetchWrapper(
                    process.env.NEXT_PUBLIC_BASE_URL || '',
                    'Bearer ' + accessToken
                )
                const {
                    data: { url },
                    ok,
                } = await fetchWrapper.post('/users/avatar', {}, formData, true)
                if (ok) setAvatar(url)
            }
        })
    }
    return (
        <div>
            <p className='text-sm text-gray-700 font-medium mb-2'>
                {t('avatar')}
            </p>
            <div className='flex gap-2'>
                <input type='hidden' value={avatar} name='avatar' />
                <input
                    ref={ref}
                    hidden
                    accept='image/png, image/jpg, image/jpeg'
                    type='file'
                    onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                            handleImageChange(e.target.files[0])
                        }
                    }}
                />
                {preview ? (
                    <img
                        src={preview}
                        width={48}
                        height={48}
                        alt='avatar'
                        className='rounded-full mr-3 h-12 w-12 object-cover'
                    />
                ) : (
                    <Avatar />
                )}
                {!disabled && (
                    <div>
                        <div className='flex gap-2'>
                            <SecondaryButton
                                size='xs'
                                onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                    e.preventDefault()
                                    ref.current?.click()
                                }}
                            >
                                {t('change')}
                            </SecondaryButton>
                            {avatar && (
                                <SecondaryButton
                                    size='xs'
                                    onClick={(
                                        e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                        e.preventDefault()
                                        setPreview(null)
                                        setAvatar('')
                                    }}
                                >
                                    {t('delete')}
                                </SecondaryButton>
                            )}
                        </div>
                        <p className='text-sm text-gray-400 mt-1'>
                            {t('avatarDescription')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

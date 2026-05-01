'use client'

import { resetUserPassword } from '@/actions/user'
import { CheckIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { MouseEvent, useState } from 'react'

export const ResetPasswordField = ({ id }: { id?: string | number }) => {
    const [isChanged, setIsChanged] = useState(false)

    return (
        <div className='w-full flex flex-col gap-1'>
            <p className='text-sm text-gray-700 font-medium'>{`Password`}</p>
            {id ? (
                <button
                    className={`bg-blue-50 text-brand-dark py-2 px-4 rounded-lg text-sm font-medium w-fit flex items-center gap-1 ${isChanged ? 'cursor-default pl-3' : 'cursor-pointer'}`}
                    onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault()
                        if (isChanged) return
                        setIsChanged(await resetUserPassword(id))
                    }}
                >
                    {isChanged ? (
                        <>
                            <CheckIcon className='w-4 h-4' /> Password Reset
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            ) : (
                <Link href={`/account-settings/reset-password`}>
                    <button className='bg-blue-50 text-brand-dark py-2 px-4 rounded-lg text-sm font-medium w-fit flex items-center gap-1'>
                        Reset Password
                    </button>
                </Link>
            )}
        </div>
    )
}

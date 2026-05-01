'use client'

import { useState } from 'react'
import NewPasswordForm from '../../../shared/ui/NewPasswordForm'
import SendCodeForm from '../../../shared/ui/SendCodeForm'
import VerifyEmailForm from '../../../shared/ui/VerifyEmailForm'

export default function ResetPassword() {
    const [currentForm, setCurrentForm] = useState<
        'sendCode' | 'verifyEmail' | 'newPassword'
    >('sendCode')
    const [email, setEmail] = useState<string | null>(null)
    const [code, setCode] = useState<string>('')
    return (
        <div className={'h-screen flex justify-center bg-gray-50'}>
            <div className='w-112 px-10 py-8 mt-12 h-fit mx-auto bg-white border border-gray-200 rounded-2xl'>
                {currentForm === 'sendCode' && (
                    <SendCodeForm
                        setCurrentForm={setCurrentForm}
                        setEmail={setEmail}
                    />
                )}
                {currentForm === 'verifyEmail' && (
                    <VerifyEmailForm
                        setCurrentForm={setCurrentForm}
                        email={email!}
                        setCode={setCode}
                    />
                )}
                {currentForm === 'newPassword' && (
                    <NewPasswordForm
                        setCurrentForm={setCurrentForm}
                        email={email!}
                        code={code}
                    />
                )}
            </div>
        </div>
    )
}

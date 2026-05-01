import { useTranslations } from 'next-intl'
import Image from 'next/image'
import LoginForm from '../../../shared/ui/LoginForm'
import Logo from '../../Logo.svg'

export default function SignIn() {
    const t = useTranslations('login')
    return (
        <div className={'h-screen flex justify-center bg-gray-50'}>
            <div className='w-112 px-10 py-8 flex flex-col gap-6 items-center mt-12 h-fit mx-auto bg-white border border-gray-200 rounded-2xl'>
                <div className='flex flex-col gap-4 items-center'>
                    <Image src={Logo} alt='Logo' />
                    <h1 className='font-bold text-2xl text-gray-900'>
                        {t('signIn.title')}
                    </h1>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

'use client'

import { SubmitButton } from '@/shared/ui/SubmitButton'
import { useRouter } from 'next/navigation'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.log(error)

    const router = useRouter()
    const [status] = error.message.split('_')

    if (status === '403') {
        router.push('/')
    }

    if (status === '401') {
        router.push('/login')
    }

    return (
        <main className='flex h-full flex-col items-center justify-center gap-2'>
            <h2 className='text-center'>Something went wrong!</h2>
            <SubmitButton className='w-fit' onClick={() => reset()}>
                Try again
            </SubmitButton>
        </main>
    )
}

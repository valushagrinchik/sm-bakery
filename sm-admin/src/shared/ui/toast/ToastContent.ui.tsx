import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'

export const ToastContent = ({
    message,
    subMessage,
    success,
}: {
    message: string
    subMessage?: string
    success?: boolean
}) => {
    return (
        <div
            className={`flex h-[52px] items-center gap-4 px-2 ${success ? 'bg-green-50' : 'bg-red-50'}`}
            id='alertToastSuccess'
        >
            <div>
                {success ? (
                    <CheckCircleIcon className='h-5 w-5 text-green-400' />
                ) : (
                    <XCircleIcon className='h-5 w-5 text-red-400' />
                )}
            </div>
            <p
                className={`my-auto text-sm font-medium ${success ? 'text-green-800' : 'text-red-800'}`}
            >
                {message}
            </p>
        </div>
    )
}

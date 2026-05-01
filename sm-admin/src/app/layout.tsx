import { ToastContainerLayout } from '@/shared/ui/toast'
import { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Figtree } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const figtree = Figtree({
    subsets: ['latin'],
    variable: '--font-figtree',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'San Martin Admin Panel',
    description: '',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const locale = await getLocale()
    const messages = await getMessages()
    return (
        <html lang={locale}>
            <body className={`${figtree.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
                <div className='fixed bottom-4 left-4 z-50'>
                    <ToastContainerLayout />
                </div>
            </body>
        </html>
    )
}

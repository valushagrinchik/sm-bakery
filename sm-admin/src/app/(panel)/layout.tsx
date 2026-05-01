import { ReactNode } from 'react'
import { PanelNavbar } from '../../shared/ui/PanelNavbar'

export default function PanelLayout({
    children,
    form,
}: Readonly<{
    children: ReactNode
    form: ReactNode
}>) {
    return (
        <main className='flex max-h-screen'>
            <PanelNavbar />
            <div className='w-full p-8 max-h-screen overflow-auto'>
                {children}
            </div>
            {form}
        </main>
    )
}

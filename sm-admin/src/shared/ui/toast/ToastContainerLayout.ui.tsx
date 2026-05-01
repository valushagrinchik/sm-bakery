'use client'

import { Slide, ToastContainer } from 'react-toastify'

export const ToastContainerLayout = () => (
    <ToastContainer
        toastClassName={() =>
            'relative flex rounded-lg justify-between overflow-hidden cursor-pointer mb-4 w-[250px] sm:w-[450px] bg-white shadow-lg'
        }
        transition={Slide}
        icon={false}
    />
)

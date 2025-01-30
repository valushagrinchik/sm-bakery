import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { PolygonDto } from '@/shared/lib/sanMartinApi/Api'
import { PinIcon } from '@/shared/ui/icons/PinIcon.ui'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { ReactNode, useState } from 'react'

export const Marker = ({
    position,
    content,
}: {
    position: PolygonDto
    content: ReactNode
}) => {
    const [clicked, setClicked] = useState(false)
    const ref = useClickOutside(() => setClicked(false))

    return (
        <AdvancedMarker
            zIndex={5000}
            onClick={() => setClicked(!clicked)}
            position={position}
        >
            <div ref={ref}>
                <PinIcon className='w-8 h-8 text-red-400' />

                {clicked && (
                    <div
                        className='absolute block min-w-[150px] ml-[-50%] mt-1'
                        onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            return
                        }}
                    >
                        {content}
                    </div>
                )}
            </div>
        </AdvancedMarker>
    )
}

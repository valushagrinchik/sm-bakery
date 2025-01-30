import { useEffect, useRef } from 'react'

export const useClickOutside = (onClickOutside: () => void) => {
    const ref = useRef<any>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                onClickOutside &&
                ref.current &&
                ref.current.contains &&
                !ref.current.contains(event.target as Node)
            ) {
                onClickOutside()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    return ref
}

import { useEffect } from 'react'
import { socket } from '../lib/socket'

export enum Rooms {
    catalogParsing = 'catalog-parsing',
}
type RoomMessage = {
    room: Rooms
}
export type CatalogParsingMessageBody = {
    parsing: boolean
    error?: string
}

type MessageBody = RoomMessage & CatalogParsingMessageBody

export const useSocket = <B>(room: Rooms, onMsgToClient: (body: B) => void) => {
    useEffect(() => {
        if (!socket.connected) {
            return
        }

        socket.on(
            'msgToClient',
            ({ room: incomeRoom, ...body }: MessageBody) => {
                if (incomeRoom != room) {
                    return
                }
                onMsgToClient(body as B)
            }
        )
        socket.emit('joinRoom', room)

        return () => {
            socket.emit('leaveRoom', room)
        }
    }, [])
}

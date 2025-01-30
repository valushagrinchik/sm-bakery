import Cookies from 'universal-cookie'

export const useDataSnapshot = (cookiesKey: string) => {
    const cookies = new Cookies()
    const storeDataSnapshot = (data: any) => {
        cookies.set(cookiesKey, data)
    }
    const deleteDataSnapshot = () => {
        cookies.remove(cookiesKey)
    }
    const getDataSnapshot = () => {
        return cookies.get(cookiesKey)
    }
    return {
        getDataSnapshot,
        storeDataSnapshot,
        deleteDataSnapshot,
    }
}

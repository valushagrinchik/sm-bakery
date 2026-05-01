//"firstName|IS_STRING, firstName|IS_NOT_EMPTY, lastName|IS_STRING, lastName|IS_NOT_EMPTY, phone|IS_STRING, phone|IS_NOT_EMPTY, email|IS_EMAIL, email|IS_NOT_EMPTY, countryId|IS_INT, countryId|IS_NOT_EMPTY, roleId|IS_ENUM, roleId|IS_NOT_EMPTY, status|IS_ENUM, status|IS_NOT_EMPTY"

export const parseErrorMessage = (message?: string) => {
    if (!message || message.indexOf('|') < 0) return { general: message }
    return Object.fromEntries(message.split(', ').map(item => item.split('|')))
}

export const StatusBadge = ({ value }: { value: string }) => {
    const text = value[0].toUpperCase() + value.slice(1)
    if (value == 'active') {
        return (
            <div className='h-5 px-2.5 py-0.5 bg-emerald-100 rounded justify-center items-center inline-flex'>
                <div className='text-center text-emerald-800 text-xs font-medium leading-none'>
                    {text}
                </div>
            </div>
        )
    }
    if (value == 'blocked' || value == 'deleted' || value == 'inactive') {
        return (
            <div className='h-5 px-2.5 py-0.5 bg-red-100 rounded justify-center items-center inline-flex'>
                <div className='text-center text-red-800 text-xs font-medium leading-none'>
                    {text}
                </div>
            </div>
        )
    }
    if (value == 'inactive') {
        return (
            <div className='h-5 px-2.5 py-0.5 bg-gray-100 rounded justify-center items-center inline-flex'>
                <div className='text-center text-gray-800 text-xs font-medium leading-none'>
                    {text}
                </div>
            </div>
        )
    }
    // Others options
    // <div className="h-5 px-2.5 py-0.5 bg-amber-100 rounded justify-center items-center inline-flex">
    //     <div className="text-center text-amber-800 text-xs font-medium leading-none">Badge</div>
    // </div>
    // <div className='h-5 px-2.5 py-0.5 bg-blue-100 rounded justify-center items-center inline-flex'>
    //     <div className="text-center text-blue-800 text-xs font-medium leading-none">Badge</div>
    // </div>
    // <div className="h-5 px-2.5 py-0.5 bg-indigo-100 rounded justify-center items-center inline-flex">
    //     <div className="text-center text-indigo-800 text-xs font-medium leading-none">Badge</div>
    // </div>
    // <div className="h-5 px-2.5 py-0.5 bg-violet-100 rounded justify-center items-center inline-flex">
    //     <div className="text-center text-violet-800 text-xs font-medium leading-none">Badge</div>
    // </div>
    // <div className="h-5 px-2.5 py-0.5 bg-pink-100 rounded justify-center items-center inline-flex">
    //     <div className="text-center text-pink-800 text-xs font-medium leading-none">Badge</div>
    // </div>

    return <>{text}</>
}

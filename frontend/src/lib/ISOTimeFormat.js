const ISOTimeFormat = (dateTime)=>{
    const date = new Date(dateTime)
    const localtime = date.toLocaleTimeString("en-us",{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true
    })
    return localtime
}

export default ISOTimeFormat
"use client"
import Popout from 'react-popout'

export default function Popup({url, change_status}){
    return(
        <Popout url={url} title='KarmaPay Payments' onClosing={()=>{console.log("Closed"); change_status()}}>
        </Popout>
    )
}
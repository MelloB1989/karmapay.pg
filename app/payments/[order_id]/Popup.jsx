"use client"
import Popout from 'react-popout'

export default function Popup({url}){
    return(
        <Popout url={url} title='KarmaPay Payments' onClosing={()=>{console.log("Closed")}}>
        </Popout>
    )
}
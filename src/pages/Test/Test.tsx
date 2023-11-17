import React from 'react'
import "./Test.css"
import { Link } from "react-router-dom"

export default function Test() {
    return (
        <>
            <div className='test'>

                Test

                <Link to="/"> Go Home </Link>
            </div>
        </>
    )
}

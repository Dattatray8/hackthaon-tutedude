import connectDB from "@/utils/dbConnection"
import { NextRequest, NextResponse } from "next/server"
/* eslint-disable @typescript-eslint/no-unused-vars */
 const test = async(_req:NextRequest)=>{
    const dbConn = await connectDB();
    console.log('dbConn', dbConn)
    return NextResponse.json({data:"hello"})
}

export {test as GET}
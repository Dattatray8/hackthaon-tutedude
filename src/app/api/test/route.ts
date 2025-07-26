import connectDB from "@/utils/dbConnection"
import { NextRequest, NextResponse } from "next/server"

 const test = async(req:NextRequest)=>{
    const dbConn = await connectDB();
    console.log('dbConn', dbConn)
    return NextResponse.json({data:"hello"})
}

export {test as GET}
import { NextResponse } from "next/server";

export async function GET(req, res){
    return NextResponse.json({msg: "Hello from Server"}, {status: 201})
}
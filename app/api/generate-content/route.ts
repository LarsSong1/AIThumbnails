import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { run } from "node:test";

export async function POST (request: NextRequest) {
    const {userInput} = await request.json()
    const user = await currentUser();
    const result = await inngest.send({
        name: "ai/generate-content",
        data: {
            userInput: userInput,
            userEmail: user?.primaryEmailAddress?.emailAddress
        }
    })


    return NextResponse.json({runId: result.ids[0]})
}
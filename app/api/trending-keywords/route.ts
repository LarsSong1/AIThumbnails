import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userInput = searchParams.get('query');
    const user = await currentUser();

    const result = await inngest.send(
        {
            name: "ai/trending-keywords",
            data: {
                userInput: userInput,
                userEmail: user?.primaryEmailAddress?.emailAddress
            }
        }
    )
    return NextResponse.json({ runId: result.ids[0] })

}
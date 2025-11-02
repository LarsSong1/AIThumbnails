import { db } from "@/configs/db";
import { AiContentTable } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";








export async function GET (request: NextRequest) {
    const user = await currentUser();
    const result = await db.select().from(AiContentTable)
    // @ts-ignore
    .where(eq(AiContentTable.userEmail, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(AiContentTable.id));

    return NextResponse.json(result)
}





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




import { db } from "@/configs/db";
import { TrendingKeywordsTable } from "@/configs/schema";

import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";




export async function GET (request: NextRequest) {
    const user = await currentUser();
    const result = await db.select().from(TrendingKeywordsTable)
    // @ts-ignore
    .where(eq(TrendingKeywordsTable.userEmail, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(TrendingKeywordsTable.id));
    return NextResponse.json(result)
}


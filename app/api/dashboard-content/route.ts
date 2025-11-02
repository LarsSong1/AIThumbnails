import { db } from "@/configs/db";
import { AiContentTable, AiThumbnailTable, TrendingKeywordsTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET (request: NextRequest) {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
        return NextResponse.json(
            { error: "Usuario no autenticado" }, 
            { status: 401 }
        );
    }
    const aiContentResult = await db.select().from(AiContentTable).where(eq(AiContentTable.userEmail, user.primaryEmailAddress?.emailAddress)).orderBy(desc(AiContentTable.id)).limit(1);
    
    const thumbailResult = await db.select().from(AiThumbnailTable).where(eq(AiThumbnailTable.userEmail, user.primaryEmailAddress?.emailAddress)).orderBy(desc(AiThumbnailTable.id)).limit(1);
    const keyWordsResult = await db.select().from(TrendingKeywordsTable).where(eq(TrendingKeywordsTable.userEmail, user.primaryEmailAddress?.emailAddress)).orderBy(desc(TrendingKeywordsTable.id)).limit(1);

 
  
   
    const context = {
        aiContents: aiContentResult,
        aiThumbnails: thumbailResult,
        trendingKeywords: keyWordsResult,
        aiContentsCount: aiContentResult.length,
        aiThumbnailsCount: thumbailResult.length,
        keyWordsCount: keyWordsResult.length
    }

    return NextResponse.json(context)


}
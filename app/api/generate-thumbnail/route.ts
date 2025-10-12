import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";
import { db } from "@/configs/db";
import { AiThumbnailTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";


export async function GET (request: NextRequest) {
    const user = await currentUser();
    const result = await db.select().from(AiThumbnailTable)
    // @ts-ignore
    .where(eq(AiThumbnailTable.userEmail, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(AiThumbnailTable.id));

    return NextResponse.json(result)
}




export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const refImage = formData.get('refImage') as File | null;
    const faceImage = formData.get('faceImage') as File | null;
    const userInput = formData.get('userInput') as string;

    const user = await currentUser();   


    const inputData = {
        userInput: userInput,
        refImage: refImage ? await getFileBufferData(refImage) : null,
        faceImage: faceImage ? await getFileBufferData(faceImage) : null,
        userEmail: user?.primaryEmailAddress?.emailAddress
    }


    console.log('Sending data to Inngest:', {
            userInput: inputData.userInput,
            hasRefImage: !!inputData.refImage,
            hasFaceImage: !!inputData.faceImage,
            userEmail: inputData.userEmail
        });

        

    console.log('Sending data to Inngest:', inputData);
    const result = await inngest.send({
        name: "ai/generate-thumbnail",
        data: inputData
    });

    return NextResponse.json({runId:result.ids[0]})

}








const getFileBufferData = async (file: File) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: buffer.toString('base64')
    }

}



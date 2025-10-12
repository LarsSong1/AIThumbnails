import { openai } from "@/inngest/functions";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get('query');
    const thumbnailUrl = searchParams.get('thumbnailUrl');

    if (thumbnailUrl) {
        // AI MODEL CALL
        const completition = await openai.chat.completions.create({
            model: 'mistralai/mistral-small-3.2-24b-instruct:free',
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Describe esta miniatura en palabras clave cortas adecuadas para buscar videos similares de YouTube.
Dame etiquetas separadas por comas. No des ningún texto de comentario, Máximo 5 etiquetas.
Asegúrate de que después de buscar esas etiquetas se obtendrán miniaturas similares de youtube`
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": thumbnailUrl,
                            }
                        }
                    ]
                }
            ]
        });
        const result = completition.choices[0].message.content;
        query = result;
    }

    console.log(query)
    // GET YOUTUBE VIDEO LIST API
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`);
    const searchData = result.data;
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    console.log(result.data);

    // GET YOUTUBE VIDEO DETAILS BY ID API

    const videoResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`);
    const videoData = videoResult.data;
    const videoStatics = videoData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount

    }));
    return NextResponse.json(videoStatics);

}
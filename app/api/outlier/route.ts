import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get('query');
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`);
    const searchData = result.data;
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    console.log(result.data);

    // GET YOUTUBE VIDEO DETAILS BY ID API

    const videoResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`);
    const videoData = videoResult.data;
    const videoStatics = videoData.items.map((item: any) => {
        const today = new Date();
        const viewCount = parseInt(item.statistics.viewCount || "0");
        const likeCount = parseInt(item.statistics.likeCount || "0");
        const commentCount = parseInt(item.statistics.commentCount || "0");

        const publishedDate = new Date(item.snippet.publishedAt);
        const daysSincePublished = Math.max((today.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24), 1);
        const viewsPerDay = viewCount / daysSincePublished;
        const engagementRate = ((likeCount + commentCount) / viewCount) * 100;

        return {
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            viewCount: viewCount,
            likeCount: likeCount,
            commentCount: commentCount,
            viewsPerDay,      
            engagementRate
        }

    });


    const viewCounts = videoStatics.map((v: any) => v.viewCount);
    const { iqr, lowerBound, upperBound } = calculateIQR(viewCounts);
    const avgViews = viewCounts.reduce((a: any, b: any) => a + b, 0) / viewCounts.length;
    const maxViewsPerDay = Math.max(...videoStatics.map((v: any) => v.viewsPerDay));
    const maxEngagementRate = Math.max(...videoStatics.map((v: any) => v.engagementRate));
    const finalResult = videoStatics.map((v: any) => {
        const isOutlier = v.viewCount < lowerBound || v.viewCount > upperBound;
        let outlierScore = 0;


        if (isOutlier && iqr > 0) {
            if (v.viewCount > upperBound) {
                outlierScore = (v.viewCount - upperBound) / iqr;
            } else if (v.viewCount < lowerBound) {
                outlierScore = (lowerBound - v.viewCount) / iqr;

            }
        }

        const smartScore =
            (v.viewCount / avgViews) * 0.5 +
            (v.viewsPerDay / maxViewsPerDay) * 0.3 +
            (v.engagementRate / maxEngagementRate) * 0.2;

        return {
            ...v,
            engagementRate: Number(v?.engagementRate?.toFixed(2)),
            viewsPerDays: Math.round(v?.viewsPerDay),
            smartScore: Number(smartScore?.toFixed(3)),
            isOutlier,
            outlierScore: Number(outlierScore?.toFixed(2)),

        }
    }).sort((a: any, b: any) => b.engagementRate - a.engagementRate);



    console.log(finalResult);
    return NextResponse.json(finalResult);
}




function calculateIQR(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return { iqr, lowerBound, upperBound };
}
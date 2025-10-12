import { is } from "drizzle-orm"

export type VideoInfo = {
    id: string,
    title: string,
    description: string,
    thumbnail: string,
    channelTitle: string,
    publishedAt: string,
    viewCount: string,
    likeCount: string,
    commentCount: string
}


export type VideoInfoWithOutlier = {
    id: string,
    title: string,
    description: string,
    thumbnail: string,
    channelTitle: string,
    publishedAt: string,
    viewCount: number,
    likeCount: number,
    commentCount: number,
    smartScore: number,
    viewsPerDay: number
    isOutlier: boolean
    engagementRate: number
    outlierScore: number
}



export type props = {
    videoList: VideoInfo[] | undefined,
    SearchSimilarThumbnails: any
}



export type VideoCardProps = {
    videoInfo: VideoInfo,
}


export type VideoCardWithOutlierProps = {
    videoInfo: VideoInfoWithOutlier,
}




export type Content = {
    id: number,
    userInput: string,
    content: subContent,
    thumbnailUrl: string,
    createdOn: string
}


export type subContent = {
    description: string,
    tags: string[],
    titles: {
        seo_score: number,
        title: string
    }[],
    prompts: string[]
}


export type VideoSearchResult = {
  position: number;
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
  views?: string;
  uploadDate?: string;
  duration?: string;
}


export type Keywords = {
    keyword: string,
    score: number
    related_queries: string[]
}



export type SEOKeywordData = {
    keywords: Keywords[];
    main_keyword: string;
}


export type KeywordList = {
    keywordsData: SEOKeywordData
}
export type ThumbnailsGeneratedType = {
    id: number,
    userInput: string,
    thumbnailUrl: string,
    refImage: string,
    userEmail: string,
    createdOn: string
}


export type GeneratedContentType = {
    id: number,
    userInput: string,
    content: ContentType,
    thumbnailUrl: string,
    userEmail: string,
    createdOn: string
}


export type TrendingKeywordsType = {
    id: number,
    userInput: string,
    keywordsData: keywordsDataType
    userEmail: string,
    createdOn: string
}




type keywordsDataType = {
    keywords: [
        {
            keyword: string,
            related_queries: string[],
            score: number
        }
    ]
}


type ContentType = {
    description: string, 
    prompts: string[],
    tags: string[],
    titles: [
        {
            title: string,
            seo_score: number
        }
    ]
    
}








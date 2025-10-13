import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function VideoListSkeleton() {
    return (
        <>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                <Skeleton key={index} className="col-span-1 w-[300px] h-[200px]" />
            ))}
        </>
    )
}

export default VideoListSkeleton
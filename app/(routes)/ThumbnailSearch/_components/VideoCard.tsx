import { VideoCardProps } from '@/types/ThumbnailSearch'
import { Eye, ThumbsUpIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function VideoCard({ videoInfo }: VideoCardProps) {

    
    return (
        <div className='lg:w-[350px] w-[250px] mx-auto cursor-pointer'>
            <Image src={videoInfo.thumbnail} alt={videoInfo.title} width={250} height={200} className='aspect-video rounded-md mx-auto lg:w-[350px] w-[250px]' />
            <div className='flex flex-col justify-between'>
                <div className='px-2'>
                    <h4 className='text-xs font-bold text-start mt-1 line-clamp-2'>{videoInfo.title}</h4>
                    <p className='text-xs text-start'>{videoInfo.channelTitle}</p>
                </div>
                <div className='flex justify-between mt-2'>
                    <div className='opacity-75 flex items-center gap-1'>
                        <Eye className='h-4 w-4' />
                        <p className='text-xs'>{videoInfo.viewCount}</p>
                    </div>
                    <div className='opacity-75 flex items-center gap-1'>
                        <ThumbsUpIcon className='h-4 w-4' />
                        <p className='text-xs'>{videoInfo.likeCount}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
import { VideoCardProps } from '@/types/ThumbnailSearch'
import { Eye, ThumbsUpIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function VideoCard({ videoInfo }: VideoCardProps) {

    
    return (
        <div className='lg:w-[350px] w-[250px] mx-auto cursor-pointer overflow-hidden rounded-sm'>
            <Image src={videoInfo.thumbnail} alt={videoInfo.title} width={250} height={200} className='aspect-video  mx-auto lg:w-[350px] w-[250px] h-auto object-cover' />
            <div className='flex flex-col justify-between border-2 border-white border-opacity-10 p-2'>
                <div className='px-2'>
                    <h4 className='text-xs font-bold text-start mt-1 line-clamp-2 text-white opacity-70'>{videoInfo.title}</h4>
                    <p className='text-xs text-start text-white opacity-50'>{videoInfo.channelTitle}</p>
                </div>
                <div className='flex justify-between mt-2 px-2'>
                    <div className='opacity-75 flex items-center gap-1'>
                        <Eye className='h-4 w-4 text-white' />
                        <p className='text-xs text-white opacity-70'>{videoInfo.viewCount}</p>
                    </div>
                    <div className='opacity-75 flex items-center gap-1'>
                        <ThumbsUpIcon className='h-4 w-4 text-white' />
                        <p className='text-xs text-white opacity-70'>{videoInfo.likeCount}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard
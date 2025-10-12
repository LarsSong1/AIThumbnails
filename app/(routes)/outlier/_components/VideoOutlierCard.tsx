import { VideoCardWithOutlierProps } from '@/types/ThumbnailSearch'
import { Eye, ThumbsUpIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

function VideoOutlierCard({ videoInfo }: VideoCardWithOutlierProps) {


    return (
        <div className='lg:w-[350px] w-[250px] mx-auto cursor-pointer relative'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <h3 className='absolute right-0 -top-1 py-1 px-4 bg-green-700 text-white rounded-md text-sm font-bold'>{videoInfo.smartScore}x</h3>

                </TooltipTrigger>
                <TooltipContent className='bg-white text-black'>
                    <p>Outlier and SmartScore</p>
                </TooltipContent>
            </Tooltip>
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='opacity-75 flex items-center gap-1'>
                                <ThumbsUpIcon className='h-4 w-4' />
                                <p className='text-xs'>{videoInfo.engagementRate}</p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className='bg-white text-black'>
                            <p>Puntuación de Enganche</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default VideoOutlierCard
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Link from 'next/link';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';
import Subtitle from '@/components/Subtitle';
import { Download } from 'lucide-react';
import { handleDownloadImage } from '@/utils/downloadAction';
import DownloaderButton from '@/app/_components/DownloaderButton';

type Thumbnail = {
    id: number,
    thumbnailUrl: string
    refImage: string
    userInput: string
    createdOn: string

}


function ThumbnailList() {
    const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GetThumnailList()
    }, [])



    const GetThumnailList = async () => {
        setLoading(true);
        const result = await axios.get('/api/generate-thumbnail');
        console.log(result.data);
        setThumbnailList(result.data);
        setLoading(false);
    }
    return (
        <div className='mt-5'>
            <Subtitle title='Miniaturas Generadas' className='mb-4' />
            <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4'>
                {
                    !loading ?
                        thumbnailList.map((thumbnail, index) => (
                            <Link href={thumbnail.thumbnailUrl} target='_blank' key={index} className="flex flex-col items-center relative z-0">
                                <Image src={thumbnail.thumbnailUrl} alt={thumbnail.thumbnailUrl} className='aspect-video w-full rounded-md' width={200} height={200} />
                                <DownloaderButton thumbnailUrl={thumbnail.thumbnailUrl} thumbnailId={thumbnail.id.toString()} />
                                <div className='w-full mt-2 relative border-white border-2 border-opacity-10 p-2 rounded-sm'>
                                    <p className='text-end text-black text-xs md:text-sm lg:text-sm font-thin absolute -right-1  -top-8 bg-green-300  py-1 px-2'><span className='font-bold '>Creado:</span> {dayjs(thumbnail.createdOn).format('DD MMMM [del] YYYY')}</p>
                                    <p className='text-xs mt-4 opacity-50 text-white '>
                                        <span className='font-bold'>Prompt: </span>
                                        {thumbnail?.userInput}
                                    </p>
                                </div>
                            </Link>
                        )) :


                        <VideoListSkeleton />

                }
            </div>
        </div>
    )
}

export default ThumbnailList
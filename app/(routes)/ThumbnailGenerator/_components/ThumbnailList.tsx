import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Link from 'next/link';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';

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
            <h2 className='font-bold'>Miniaturas Generadas</h2>
            <div className='grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4'>
                {
                    !loading ?
                        thumbnailList.map((thumbnail, index) => (
                            <Link href={thumbnail.thumbnailUrl} target='_blank' key={index} className="flex flex-col items-center ">
                                <Image src={thumbnail.thumbnailUrl} alt={thumbnail.thumbnailUrl} className='aspect-video w-full rounded-md' width={200} height={200} />
                                <div className='w-full mt-2'>
                                    <p className='text-end text-sm pe-2 font-bold'>{dayjs(thumbnail.createdOn).format('DD MMMM [del] YYYY')}</p>
                                    {/* <p className='text-xs'>{thumbnail.userInput}</p> */}
                                </div>
                            </Link>
                        )) :
                        
                        <VideoListSkeleton/>
                }
            </div>
        </div>
    )
}

export default ThumbnailList
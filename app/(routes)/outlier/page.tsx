'use client'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button';
import { VideoInfoWithOutlier } from '@/types/ThumbnailSearch';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react'
import VideoOutlierCard from './_components/VideoOutlierCard';
import { Skeleton } from '@/components/ui/skeleton';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';

function Outlier() {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [videoList, setVideoList] = useState<VideoInfoWithOutlier[]>();

    const onSearch = async () => {
        try {
            setLoading(true);
            const result = await axios.get(`/api/outlier?query=${userInput}`);
            console.log(result.data);
            setLoading(false);
            setVideoList(result.data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    return (
        <section>
            <PageTitle title='Outlier' subtitle='Busca y encuentra videos con alto rendimiento en comparacion con el resto de videos de una canal' />
            <div className='w-full mt-4 flex  border-2 border-black rounded-md px-4 py-2'>
                <input className='w-full outline-none' type="text" placeholder='Ingresa que quieres buscar' onChange={e => setUserInput(e.target.value)} />
                <Button onClick={onSearch} disabled={loading || !userInput}>
                    {
                        loading ? <Loader2 className='animate-spin' /> : <Search />
                    }
                </Button>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {
                loading ?
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        <VideoListSkeleton />
                    </div>

                    :
                    videoList && videoList.map((video, index) => (
                        <div key={index} className='w-full flex items-center justify-center mt-4'>
                            <VideoOutlierCard videoInfo={video} key={index} />
                        </div>
                    ))

            }
            </div>
        </section>
    )
}

export default Outlier
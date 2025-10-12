'use client'
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import { VideoInfo } from '@/types/ThumbnailSearch'
import axios from 'axios'
import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import ThumbnailSearchList from './_components/ThumbnailSearchList'
import VideoListSkeleton from '@/app/_components/VideoListSkeleton'



function ThumbnailSearch() {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [videoList, setVideoList] = useState<VideoInfo[]>();

    const onSearch = async () => {
        setLoading(true);
        const result = await axios.get(`/api/search-thumbnail?query=${userInput}`);
        console.log(result.data);
        setLoading(false);
        setVideoList(result.data);
    }

    const SearchSimilarThumbnails = async (url: string) => {
        setLoading(true);
        const result = await axios.get(`/api/search-thumbnail?thumbnailUrl=${url}`);
        console.log(result.data);
        setLoading(false);
        setVideoList(result.data);

    }
    return (
        <section>
            <PageTitle title='Buscador de Thumbnails' subtitle='Busca y encuentra tus thumbnails favoritos' />
            <div className='w-full mt-4 flex  border-2 border-black rounded-md px-4 py-2'>
                <input className='w-full outline-none' type="text" placeholder='Ingresa que quieres buscar' onChange={e => setUserInput(e.target.value)} />
                <Button onClick={onSearch} disabled={loading || !userInput}>
                    {
                        loading ? <Loader2 className='animate-spin' /> : <Search />
                    }
                </Button>
            </div>
            {
                loading ?
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        <VideoListSkeleton />
                    </div>

                    :
                    <ThumbnailSearchList SearchSimilarThumbnails={(url: string) => SearchSimilarThumbnails(url)} videoList={videoList} />

            }
        </section>
    )
}

export default ThumbnailSearch
'use client'

import PageTitle from '@/components/PageTitle'
import React, { useEffect, useState } from 'react'
import CardBox from './_components/CardBox'
import { DraftingCompass, Focus, Image, KeyIcon } from 'lucide-react'
import Subtitle from '@/components/Subtitle'
import axios from 'axios'
import { GeneratedContentType, ThumbnailsGeneratedType, TrendingKeywordsType } from '@/types/schemaTables'
import DownloaderButton from '@/app/_components/DownloaderButton'
import dayjs from 'dayjs'

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [thumbnailsCount, setThumbnailsCount] = useState(0);
    const [keyWordsCount, setKeywordsCount] = useState(0);
    const [contentGeneratedCount, setContentGeneratedCount] = useState(0);
    const [thumbnailsGenerated, setThumbnailsGenerated] = useState<ThumbnailsGeneratedType[]>([]);
    const [keywordsGenerated, setKeywordsGenerated] = useState<TrendingKeywordsType[]>([]);
    const [contentGenerated, setContentGenerated] = useState<GeneratedContentType[]>([]);

    useEffect(() => {
        getUserData();
    }, [])
    const getUserData = async () => {
        setLoading(true);
        const result = await axios.get('/api/dashboard-content');
        console.log(result.data, "result");
        const response = result.data;
        setThumbnailsCount(response.aiThumbnailsCount);
        setKeywordsCount(response.keyWordsCount);
        setContentGeneratedCount(response.aiContentsCount);
        setThumbnailsGenerated(response.aiThumbnails);
        setKeywordsGenerated(response.trendingKeywords);
        setContentGenerated(response.aiContents);
        setLoading(false);
    }




    return (
        <div>
            <PageTitle title='Dashboard' subtitle='Bienvenido a tu Dashboard' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>

                <CardBox icon={<Image />} title='Miniaturas Generadas' number={thumbnailsCount} />
                <CardBox icon={<Focus />} title='Contenido Generado' number={contentGeneratedCount} />
                <CardBox icon={<KeyIcon />} title='Palabras Claves Generadas' number={keyWordsCount} />

            </div>
            <div className='mt-4'>
                <Subtitle title='Actividad Reciente' />
                <div className='mt-2'>
                    <ul className='flex flex-col gap-4'>
                        {thumbnailsGenerated.map((thumbnail, index) => (

                            <li key={index} className='border-2 border-white border-opacity-10 p-2 rounded-sm flex items-center justify-start gap-2 relative'>
                                <div className='w-[10px] h-[10px] bg-green-700 rounded-full'>

                                </div>
                                <div className='flex flex-col w-full relative space-y-2'>
                                    <DownloaderButton className='absolute -top-2' thumbnailId={thumbnail.id.toString()} thumbnailUrl={thumbnail.thumbnailUrl} />
                                    <h5 className='text-white text-xs font-bold'>Miniatura generada</h5>
                                    <h6 className='text-white text-opacity-75 w-[80%] text-xs'>
                                        <span className='font-bold '>Descripción: </span>
                                        {thumbnail?.userInput}</h6>
                                    <p className='text-white text-xs self-end text-opacity-75'>
                                        {dayjs(thumbnail.createdOn).format('DD MMMM [del] YYYY')}
                                    </p>
                                </div>
                            </li>
                        ))}

                        {
                            contentGenerated.map((content, index) => (
                                <li key={index} className='border-2 border-white border-opacity-10 p-2 rounded-sm flex items-center justify-start gap-2'>
                                    <div className='w-[10px] h-[10px] bg-green-700 rounded-full'>

                                    </div>
                                    <div className='flex flex-col w-full relative space-y-2'>
                                        <div>
                                            <div className='space-y-2'>
                                                <h5 className='text-white text-xs font-bold'>Contenido Generado</h5>
                                                <h6 className='text-white text-opacity-75 w-[80%] text-xs'>
                                                    <span className='font-bold '>Descripción: </span>
                                                    {content?.userInput}
                                                </h6>
                                            </div>
                                            <div>
                                                <DownloaderButton className='absolute -top-2' thumbnailId={content.id.toString()} thumbnailUrl={content.thumbnailUrl} />
                                            </div>
                                        </div>
                                        <div className='overflow-hidden'>
                                            <p className='text-white text-xs'>Tags Recomendados</p>
                                            <div className='flex lg:justify-start justify-center lg:flex-nowrap flex-wrap lg:items-center gap-2 text-center mt-2'>
                                                {
                                                    content?.content.tags.map((tag, index) => (
                                                        <p className='text-black font-bold text-xs w-[100px] flex justify-center items-center h-[50px] rounded-md  bg-green-700 ' key={index}>{tag}</p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-white text-xs font-bold'>Titulos recomendados</p>
                                            <div className='w-[90%]'>
                                                {
                                                    content?.content.titles.map((title, index) => (
                                                        <div key={index} className='flex items-center gap-4 justify-between'>

                                                            <p className='text-white text-xs text-opacity-50' key={index}>{title.title}</p>
                                                            <p className='text-white  bg-green-600 px-2 py-1 rounded-md'>
                                                                {title.seo_score}
                                                            </p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <p className='text-white text-xs self-end text-opacity-75'>
                                            {dayjs(content.createdOn).format('DD MMMM [del] YYYY')}
                                        </p>
                                    </div>
                                </li>
                            ))
                        }

                        {
                            keywordsGenerated.map((keyword, index) => (
                                <li key={index} className='border-2 border-white border-opacity-10 p-2 rounded-sm flex items-center justify-start gap-2 relative'>
                                    <div className='w-[10px] h-[10px] bg-green-700 rounded-full'>

                                    </div>
                                    <div className='flex flex-col w-full relative space-y-2'>
                                  
                                        <h5 className='text-white text-xs font-bold'>Keywords Generados</h5>
                                        <h6 className='text-white text-opacity-75 w-[80%] text-xs'>
                                            <span className='font-bold '>Prompt: </span>
                                            {keyword?.userInput}
                                        </h6>
                                        <h6 className='text-white text-opacity-75 w-[80%] text-xs'>
                                            Listado de Keywords y puntaje de SEO
                                        </h6>

                                        {
                                            keyword?.keywordsData.keywords.map((item, index) => (
                                                <div key={index} className='flex justify-between'>

                                                    <p className='text-white text-xs'>{item.keyword}</p>
                                                    <div className='bg-green-600 px-2 py-1 rounded-md text-white'>
                                                        {item.score}
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        <p className='text-white text-xs self-end text-opacity-75'>
                                            {dayjs(keyword.createdOn).format('DD MMMM [del] YYYY')}
                                        </p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
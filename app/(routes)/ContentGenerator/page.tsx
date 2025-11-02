'use client'

import { RunStatus } from '@/app/services/GlobalApi';
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import { Content, VideoInfoWithOutlier } from '@/types/ThumbnailSearch';
import axios from 'axios';
import { Loader2, Settings, TestTubeDiagonal, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ContentDisplay from './_components/ContentDisplay';
import Subtitle from '@/components/Subtitle';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { GeneratedContentType } from '@/types/schemaTables';
import DownloaderButton from '@/app/_components/DownloaderButton';

function ContentGenerator() {
    const [userInput, setUserInput] = useState<string>('');
    const [generatedContent, setGeneratedContent] = useState<GeneratedContentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<Content>();





    useEffect(() => {
        GetContentGenerated();
    }, [])


    const GetContentGenerated = async () => {
        const response = await axios.get('/api/generate-content');
        console.log(response);
        setGeneratedContent(response.data);
    }

    const onGenerate = async () => {
        try {
            setLoading(true);
            const result = await axios.post(`/api/generate-content`, {
                userInput: userInput
            });
            while (true) {
                const runStatus = await RunStatus(result.data.runId)
                console.log("here", runStatus)
                if (runStatus && runStatus[0]?.status == 'Completed') {
                    console.log(runStatus.data);
                    setContent(runStatus[0].output[0]);
                    setLoading(false);
                    break
                }
                if (runStatus && runStatus[0]?.status == 'Cancelled') {
                    setLoading(false);
                    break
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // setVideoList(result.data);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div>
            <PageTitle title='Generación de Contenido' subtitle='Genera contenido con IA para optimiar tus videos' />
            <div className='w-full mt-4 flex  border-2 border-black rounded-md  py-2 relative'>
                <textarea className='w-full outline-none p-2 bg-black border-2 text-sm placeholder:opacity-50 text-white text-opacity-50 border-white border-opacity-10 h-40 rounded-sm resize-none' placeholder='Ingresa las caracteristicas del contenido que quieres generar z-0' onChange={e => setUserInput(e.target.value)} />
                <Button className='absolute right-2 bottom-4 rounded-sm z-10 cursor-pointer' onClick={onGenerate} disabled={loading || !userInput}>
                    {
                        loading ? <Loader2 className='animate-spin text-black' /> : <Upload className='text-black' />
                    }
                </Button>
            </div>
            {/* @ts-ignore */}
            <ContentDisplay content={content} loading={loading} />

            <div>
                <Subtitle title='Historial de contenido generado' className='mb-4' />

                <div className='max-h-[500px] overflow-y-scroll'>
                    {
                        generatedContent.map((item, index) => (
                            <Accordion key={index} type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className='text-white w-full'>
                                        <div className='flex w-full justify-between'>
                                            <p className='font-bold'>Contenido generado #{item.id}</p>
                                            <p>{item?.createdOn}</p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className='relative w-full'>
                                            <div className='space-y-2 w-[90%]'>
                                                <h3 className='text-white font-bold'>Descripcion recomendada</h3>
                                                <p className='text-white text-xs text-opacity-75'>{item?.content.description}</p>
                                            </div>
                                            <div className='w-[10%]'>
                                                <DownloaderButton thumbnailUrl={item?.thumbnailUrl} thumbnailId={item?.id.toString()} />
                                            </div>
                                        </div>
                                        <div className='space-y-2 mt-4'>
                                            <h3 className='text-white font-bold'>Descripcion recomendada</h3>
                                            <div className='flex overflow-hidden lg:flex-nowrap flex-wrap gap-2'>

                                                {
                                                    item.content.tags.map((tag, indexTag) => (
                                                        <p key={indexTag} className='text-white bg-green-700 text-xs py-2 px-1 rounded-sm'>{tag}</p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className='mt-4'>
                                            <h3 className='text-white font-bold'>Titulo recomendado</h3>
                                            {
                                                item.content.titles.map((title, indexTitle) => (
                                                    <div key={indexTitle} className='flex justify-between items-center space-y-2'>
                                                        <p className='text-white text-xs text-opacity-75'>{title.title}</p>
                                                        <p className='text-white bg-green-700 px-2 py-1 rounded-sm text-xs text-opacity-75'>{title.seo_score}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default ContentGenerator
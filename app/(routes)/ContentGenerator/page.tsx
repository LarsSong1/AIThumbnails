'use client'

import { RunStatus } from '@/app/services/GlobalApi';
import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button'
import { Content, VideoInfoWithOutlier } from '@/types/ThumbnailSearch';
import axios from 'axios';
import { Loader2, Settings, TestTubeDiagonal } from 'lucide-react';
import React, { useState } from 'react'
import ContentDisplay from './_components/ContentDisplay';

function ContentGenerator() {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<Content>();


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
                <input className='w-full outline-none p-2 bg-black border-2 text-sm placeholder:opacity-50 text-white text-opacity-50 border-white border-opacity-10 rounded-sm' type="text" placeholder='Ingresa las caracteristicas del contenido que quieres generar z-0' onChange={e => setUserInput(e.target.value)} />
                <Button className='absolute right-0 rounded-sm z-10 cursor-pointer' onClick={onGenerate} disabled={loading || !userInput}>
                    {
                        loading ? <Loader2 className='animate-spin text-black' /> : <TestTubeDiagonal className='text-black'/>
                    }
                </Button>
            </div>
            {/* @ts-ignore */}
            <ContentDisplay content={content} loading={loading} />

        </div>
    )
}

export default ContentGenerator
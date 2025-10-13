'use client'

import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Settings } from 'lucide-react';
import React, { useState } from 'react'
import KeyWordsList from './_components/KeyWordsList';
import { RunStatus } from '@/app/services/GlobalApi';
import { KeywordList } from '@/types/ThumbnailSearch';



function TrendingKeywords() {
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState<string>();
    const [keyWordsList, setKeyWordsList] = useState<KeywordList>();

    const onSearch = async () => {
        try {
            setLoading(true);
            const result = await axios.get(`/api/trending-keywords?query=${userInput}`);
            console.log(result.data, 'data de api');
            while (true) {
                const runStatus = await RunStatus(result.data.runId)
                console.log("here", runStatus)
                if (runStatus && runStatus[0]?.status == 'Completed') {
                    console.log(runStatus.data);
                    setKeyWordsList(runStatus[0]?.output[0]);
                    setLoading(false);
                    break
                }
                if (runStatus && runStatus[0]?.status == 'Cancelled') {
                    setLoading(false);
                    break
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div>
            <PageTitle title='Keywords' subtitle='Busca el tema de interes y automaticamente recibe las keywords que usan los creados de contenido de ese tema que logran mas posicionamiento ' />
            <div className='w-full mt-4 flex  border-2 border-black rounded-md py-2 relative'>
                <input className='w-full outline-none p-2 bg-black border-2 text-sm placeholder:opacity-50 text-white text-opacity-50 border-white border-opacity-10 rounded-sm' type="text" placeholder='Ingresa las caracteristicas del contenido que quieres generar' onChange={e => setUserInput(e.target.value)} />
                <Button className='absolute right-0 rounded-sm cursor-pointer' onClick={onSearch} disabled={loading || !userInput}>
                    {
                        loading ? <Loader2 className='animate-spin text-black' /> : <Settings className='text-black' />
                    }
                </Button>
            </div>
            <KeyWordsList loading={loading} keywordsList={keyWordsList}/>
        </div>
    )
}

export default TrendingKeywords
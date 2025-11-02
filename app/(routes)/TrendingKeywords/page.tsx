'use client'

import PageTitle from '@/components/PageTitle'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import KeyWordsList from './_components/KeyWordsList';
import { RunStatus } from '@/app/services/GlobalApi';
import { KeywordList } from '@/types/ThumbnailSearch';
import Subtitle from '@/components/Subtitle';
import { TrendingKeywordsType } from '@/types/schemaTables';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"



function TrendingKeywords() {
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState<string>();
    const [TrendingKeywordsGenerated, setTrendingKeywordsGenerated] = useState<TrendingKeywordsType[]>([]);
    const [keyWordsList, setKeyWordsList] = useState<KeywordList>();


    useEffect(() => {
        getTrendingKeywords();
    }, [])


    const getTrendingKeywords = async () => {
        const result = await axios.get('/api/trending-keywords/keywords');
        setTrendingKeywordsGenerated(result.data);
    }


    console.log(TrendingKeywordsGenerated);

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
            <KeyWordsList loading={loading} keywordsList={keyWordsList} />


            <div>
                <Subtitle title='Historial de keywords generados' />
                {
                    TrendingKeywordsGenerated.map((item, index) =>
                        <Accordion key={index} type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='text-white w-full'>
                                    <div className='flex w-full justify-between'>
                                        <p className='font-bold'>Keywords Generados #{item.id}</p>
                                        <p>{item?.createdOn}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <h3 className='text-white bg-green-700 px-2 py-1 rounded-sm mb-4'>Input: <span className='text-xs'>{item.userInput}</span></h3>
                                    <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-2'>
                                        {
                                            item.keywordsData.keywords
                                            .sort((a, b) => b.score - a.score)
                                            .map((keywordItem, indexKey) => (
                                                <div className='border-2 border-white p-2 border-opacity-10' key={indexKey}>

                                                    <div className='flex items-center justify-between'>
                                                        <div>
                                                            <h5 className='text-green-700 font-bold'>Keyword </h5>
                                                            <p className='text-white'>{keywordItem.keyword}</p>
                                                        </div>
                                                        <h6 className='text-white px-2 py-1 bg-green-700 rounded-sm'>{keywordItem.score}</h6>
                                                    </div>
                                                    <div>
                                                        <h5 className='text-green-700 font-bold'>Sugerencias con IA</h5>
                                                        {
                                                            keywordItem.related_queries.map((queryItem, indexQuery) =>
                                                                <div key={indexQuery} className='flex items-center gap-2'>
                                                                    <div className='bg-green-700 h-[5px] w-[5px] rounded-full'>

                                                                    </div>
                                                                    <p key={indexQuery} className='text-white'>{queryItem}</p>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                            )
                                        }
                                    </div>

                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )
                }
            </div>
        </div>
    )
}

export default TrendingKeywords
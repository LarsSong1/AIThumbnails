import Subtitle from '@/components/Subtitle'
import { Skeleton } from '@/components/ui/skeleton'
import { KeywordList, SEOKeywordData } from '@/types/ThumbnailSearch'
import { it } from 'node:test'
import React from 'react'



type Props = {
    keywordsList: KeywordList | undefined, 
    loading: boolean
}


function KeyWordsList({loading, keywordsList}: Props) {
  return (
    <section className='mt-4'>
        {
            loading ? 
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-4'>
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
            :
            <div>
                <Subtitle title='Keywords' className='mb-4' />
                <div className='mt-2 grid grid-cols-1 md:grid-cols-2 gap-10 lg:grid-cols-4'>

               {keywordsList?.keywordsData?.keywords.map((item, index) => (
                   <div key={index} className='flex w-[250px] px-4 py-2 rounded-sm bg-black border-2 border-white border-opacity-10 items-center justify-around relative'>
                        <h2 className='text-white opacity-75 font-bold text-sm'>{item.keyword}</h2>
                        <span className='text-white absolute -right-10 -top-1 bg-green-500 px-4 py-2 '>{item.score}</span>
                    </div>
                   
                ))}
                {/* poner para cada que se haga hover sobre un query salgan los related_queries que son los que estan relacionados y generados con ia */}
                </div>
            </div>
        }
    </section>
  )
}

export default KeyWordsList
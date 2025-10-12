import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Content } from '@/types/ThumbnailSearch'
import Image from 'next/image'
import React from 'react'


type Props = {
  content: Content
  loading: boolean
}

function ContentDisplay({ content, loading }: Props) {
  return (
    <div>
      {
        loading ?
          <div>
            <div className='grid grid-cols-2 gap-5'>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </div>
          :
          <div>
            {
              content ?
                <div className='grid grid-cols-1 px-4 mt-4'>
                  {/* titles */}
                  <div className=''>
                    <h2 className='font-bold'>Titulos con Engagement Sugeridos</h2>
                    <div className=''>
                      {content?.content.titles.map((item, index) => (
                        <div className='border-b-2 mb-2 items-center border-gray-200 flex justify-between' key={index}>
                          <h2 className='text-sm'>{item?.title}</h2>
                          <div className='bg-green-700 px-4 py-2 rounded-sm'>
                            <p className='text-sm text-white font-bold'>{item?.seo_score}</p>
                          </div>
                        </div>

                      ))}
                    </div>
                  </div>

                  {/* description */}
                  <div className='mt-2'>
                    <h2 className='font-bold'>Titulos con Engagement Sugeridos</h2>
                    <p className='text-sm mt-2'>{content?.content.description}</p>
                  </div>

                  {/* tags */}
                  <div className='mt-4'>
                    <h2 className='font-bold mt-2'>Tags recomendados para tus videos</h2>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {content?.content.tags.map((item, index) => (

                        <Badge className='bg-green-700 px-2 py-2' key={index}>{item}</Badge>

                      ))}
                    </div>
                  </div>

                  {/* thumbnail */}
                  <div className='mt-4'>
                    <h2 className='font-bold'>Miniatura Generada</h2>
                    {
                      content?.thumbnailUrl ?

                        <Image className='aspect-video w-full rounded-sm mt-2' width={250} height={200} src={content?.thumbnailUrl} alt={content?.thumbnailUrl} /> :
                        <p>No se ha generado ninguna miniatura</p>
                    }
                  </div>
                </div>
                :
                <div></div>
            }
          </div>
      }
    </div>
  )
}

export default ContentDisplay
import { props} from '@/types/ThumbnailSearch'
import React from 'react'
import VideoCard from './VideoCard'
import Subtitle from '@/components/Subtitle'

function ThumbnailSearchList({videoList, SearchSimilarThumbnails}: props) {
  return (
    <section className='mt-4'>
      <Subtitle title='Miniaturas encontradas' className='mb-4' />
      <div className='grid mt-2 grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-2 w-full'>
        {videoList&&videoList.map((video, index) => (
          <div key={index} onClick={()=>SearchSimilarThumbnails(video.thumbnail)}>
            <VideoCard videoInfo={video} key={index} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ThumbnailSearchList
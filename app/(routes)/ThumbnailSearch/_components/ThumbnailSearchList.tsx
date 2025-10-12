import { props} from '@/types/ThumbnailSearch'
import React from 'react'
import VideoCard from './VideoCard'

function ThumbnailSearchList({videoList, SearchSimilarThumbnails}: props) {
  return (
    <section className='mt-4'>
      <h4 className='font-bold'>Miniaturas encontradas</h4>
      <div className='grid mt-2 grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 w-full'>
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
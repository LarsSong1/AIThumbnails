import React from 'react'

const PageTitle = ({title, subtitle}: {title: string, subtitle: string}) => {
  return (
    <div>
        <h1 className='text-3xl font-bold inline-block bg-gradient-to-br from-[#64FF10] via-green-200 to-white bg-clip-text text-transparent'>{title}</h1>
        <h4 className='text-sm font-thin text-white opacity-75'>{subtitle}</h4>
    </div>
  )
}

export default PageTitle
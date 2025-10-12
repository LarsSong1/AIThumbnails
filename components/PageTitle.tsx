import React from 'react'

const PageTitle = ({title, subtitle}: {title: string, subtitle: string}) => {
  return (
    <div>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <h4 className='text-sm opacity-75'>{subtitle}</h4>
    </div>
  )
}

export default PageTitle
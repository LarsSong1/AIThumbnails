import React from 'react'

const Subtitle = ({title, className}: {title: string, className?: string}) => {
  return (
    <h3 className={`bg-gradient-to-br to-white via-white from-[#64FF10] bg-clip-text text-transparent font-bold ${className}`}>{title}</h3>
  )
}

export default Subtitle
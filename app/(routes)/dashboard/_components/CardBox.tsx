import React from 'react'

const CardBox = ({icon, title, number}: {icon: React.ReactNode, title: string, number: number}) => {
  return (
    <div className='shadow-md border-opacity-10 border-white border-2 p-4 rounded-md space-y-2'>
        <div className='bg-green-600 px-2 py-2 rounded-sm w-[50px] flex justify-center items-center'>
            {icon}

        </div>
        <div className='text-white text-sm font-thin'>
            <h3>{title}</h3>
        </div>
        <p className='text-white text-4xl'>{number}</p>

    </div>
  )
}

export default CardBox
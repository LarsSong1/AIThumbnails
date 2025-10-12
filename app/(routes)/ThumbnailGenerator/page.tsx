'use client'

import { RunStatus } from '@/app/services/GlobalApi';
import axios from 'axios';
import { ArrowUp, Divide, ImagePlus, Loader2, User, X } from 'lucide-react'
import Image from 'next/image';
import React, { use, useState } from 'react'
import ThumbnailList from './_components/ThumbnailList';
import PageTitle from '@/components/PageTitle';

const ThumbnailGenerator = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<any>();
  const [faceImage, setFaceImage] = useState<string>();
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>();
  const [faceImagePreview, setFaceImagePreview] = useState<string>();
  const [loading, setLoading] = useState(false)
  const [outputThumbnailImage, setOutputThumbnailImage] = useState('');

  const onSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    userInput && formData.append('userInput', userInput);
    referenceImage && formData.append('refImage', referenceImage);
    faceImage && formData.append('faceImage', faceImage);



    // Post request to the API endpoint
    const result = await axios.post('/api/generate-thumbnail', formData)
    console.log(result.data, "result", result.data.runId, 'result[0]');
    //
    while (true) {
      const runStatus = await RunStatus(result.data.runId)
      console.log("here", runStatus)
      if (runStatus && runStatus[0]?.status == 'Completed') {
        console.log(runStatus.data);
        setOutputThumbnailImage(runStatus[0].output[0].thumbnailUrl);
        setLoading(false);
        break
      }
      if (runStatus && runStatus[0]?.status == 'Cancelled') {
        setLoading(false);
        break
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  }

  const onHandleFileChange = (field: string, e: any) => {
    const selectedFile = e.target.files[0];


    if (!selectedFile) return

    if (field == 'referenceImage') {
      setReferenceImage(selectedFile);
      setReferenceImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setFaceImage(selectedFile)
      setFaceImagePreview(URL.createObjectURL(selectedFile));
    }
  }
  return (
    <div>
      <PageTitle title='Generador de Miniaturas' subtitle='Puedes generar tus miniaturas'/>
    
      <div>
        {
          loading ?
            <div className='w-full bg-secondary rounded-md flex items-center justify-center'>
              <Loader2 className='animate-spin' />
              <h2>Espera mientras se genera tu miniatura</h2>
            </div>
            :
            <div>
              {
                outputThumbnailImage && <Image alt='imagen-de-referencia' width={500} height={400} className='aspect-video w-full' src={outputThumbnailImage} />
              }
            </div>

        }
      </div>
      <div className='mt-4 flex gap-4 justify-center items-center border-2 rounded-md px-2 bg-secondary'>
        <textarea placeholder='Ingresa la descripción de tu video' className='w-full p-2  rounded-md text-black outline-0 bg-secondary'
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className='bg-green-700 flex justify-center items-center p-2 rounded-full h-[35px] w-[35px] cursor-pointer' onClick={onSubmit}>
          <ArrowUp className='text-white' />
        </div>


      </div>
      <div className='flex gap-2 justify-center mt-2 lg:flex-nowrap flex-wrap'>
        <label htmlFor="referenceImageUpload" className='cursor-pointer w-full'>
          {!referenceImagePreview ? (
            <div className='bg-secondary p-2 border-2 rounded-md flex justify-center items-center '>
              <ImagePlus />
              <h5>Imagen de Referencia</h5>
            </div>
          ) :
            <div className='relative'>
              <X className='absolute right-0 bg-red-600 rounded-md text-white m-2' onClick={() => setReferenceImagePreview(undefined)} />
              <Image alt='imagen-de-referencia' width={100} height={100} className='w-full h-full object-cover rounded-md' src={referenceImagePreview} />
            </div>
          }
        </label>
        <input type="file" id="referenceImageUpload" className='hidden' onChange={(e) => onHandleFileChange('referenceImage', e)} />

        <label htmlFor="includeFace" className='cursor-pointer w-full relative'>
          {!faceImagePreview ? (
            <div className='bg-secondary p-2 border-2 rounded-md flex justify-center items-center w-full'>
              <User />
              <h5>Incluir Cara</h5>
            </div>
          ) :
            <div>
              <X className='absolute right-0 m-2 bg-red-600 rounded-md  text-white' onClick={() => setFaceImagePreview(undefined)} />
              <Image alt='cara' width={100} height={100} className='w-full h-full object-cover rounded-md' src={faceImagePreview} />
            </div>
          }
        </label>
        <input type="file" id='includeFace' className='hidden' onChange={(e) => onHandleFileChange('faceImage', e)} />
      </div>
      <section>
        <ThumbnailList/>
      </section>
    </div>
  )
}

export default ThumbnailGenerator
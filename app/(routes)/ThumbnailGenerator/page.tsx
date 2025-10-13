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
      <PageTitle title='AI Thumbnail Generator' subtitle='Proporciona una descripcion sobre la miniatura que deseas crear usando imagenes de referencia o tu propio perfil' />

      <div className='mt-4 grid lg:grid-cols-8 gap-4'>
        <div className='w-full lg:col-span-4 col-span-full'>
          {
            loading ?
              <div className='w-full bg-secondary rounded-sm flex items-center justify-center h-[300px] bg-black border-white border-2 border-opacity-10'>
                <Loader2 className='animate-spin text-white' />
                <h2 className='text-white'>Espera mientras se genera tu miniatura</h2>
              </div>
              :
              <div className='w-full bg-secondary rounded-sm flex items-center justify-center h-[400px] bg-black border-white border-2 border-opacity-10 overflow-hidden'>
                {
                  outputThumbnailImage && <Image alt='imagen-de-referencia' width={400} height={300} className='aspect-video rounded-sm w-full' src={outputThumbnailImage} />
                }
              </div>

          }
          <div className='flex gap-2 justify-center mt-2 lg:flex-nowrap flex-wrap'>
            <label htmlFor="referenceImageUpload" className='cursor-pointer w-full'>
              {!referenceImagePreview ? (
                <div className='bg-secondary p-2 bg-black text-white border-opacity-10 border-white gap-2 border-2 rounded-md flex justify-center items-center '>
                  <ImagePlus className='opacity-50'/>
                  <h5 className='text-sm opacity-50'>Imagen de Referencia</h5>
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
                <div className='bg-secondary p-2 border-2 border-white border-opacity-10 bg-black text-white rounded-md flex gap-2 justify-center items-center w-full'>
                  <User className='opacity-50'/>
                  <h5 className='text-sm opacity-50'>Incluir Cara</h5>
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
        </div>
        <div className='w-full lg:col-span-4 col-span-full'>
          <div className=' flex gap-4 justify-center items-center border-2 border-white border-opacity-10 rounded-md'>
            <textarea placeholder='Ingresa la descripción de tu video' className='w-full px-4 py-4 text-sm h-[550px] rounded-md text-white text-opacity-50 outline-0 resize-none bg-black placeholder:opacity-50'
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
          <div className='bg-gradient-to-br from-[#64FF10] via-green-200 to-white flex justify-center items-center p-2 rounded-sm mt-4 w-full cursor-pointer gap-2' onClick={onSubmit}>
            <h4 className='text-black font-bold text-sm'>Generar</h4>
            <ArrowUp className='text-black' height={15} />
          </div>


        </div>

      </div>
      <section>
        <ThumbnailList />
      </section>
    </div>
  )
}

export default ThumbnailGenerator
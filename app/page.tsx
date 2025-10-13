"use client"
import Image from "next/image";

import { SignIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ImageIcon, KeyIcon, Search, Sheet, Youtube } from "lucide-react";
import Subtitle from "@/components/Subtitle";
import { SheetContent } from "@/components/ui/sheet";

export default function Home() {


  const { user } = useUser();

  return (
    <div className="bg-black">
      <header className="flex  flex-wrap sm:justify-start  sm:flex-nowrap z-50 w-full bg-black border-b border-gray-200 border-opacity-10 text-sm py-3 sm:py-0 dark:bg-neutral-800 dark:border-neutral-700">
        <nav className="relative  p-4 max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
          <div className="flex items-center justify-between">
            <div>
              <Image src={'/AIToolsLogo.svg'} alt="logo" width={100} height={100} />
            </div>
          </div>
          <div id="navbar-collapse-with-animation" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7 cursor-pointer">

              {/* Clerk Authentication  */}
              {!user ? <SignInButton mode='modal' signUpForceRedirectUrl={'/dashboard'}>
                <div className="flex items-center gap-x-2 font-medium text-white hover:text-green-600 sm:border-s sm:border-gray-300 py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 dark:border-neutral-700" >
                  <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  Iniciar Sesión
                </div>
              </SignInButton>
                :
                <UserButton />
              }
            </div>
          </div>
        </nav>
      </header>
      <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="block font-bold text-white opacity-75 text-4xl md:text-5xl lg:text-6xl">
              El arte del diseño, democratizado por
              <span className="bg-clip-text bg-gradient-to-tl to-white from-green-400 text-transparent"> IA</span>
            </h1>
          </div>


          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="bg-clip-text bg-gradient-to-tl to-white from-green-600 text-transparent ">
              Genera miniaturas y consigue engagement con nuestras soluciones de IA
            </p>
            <p className="text-xs text-white opacity-50">UNEMI <br /> @Jair Gavilanez  @Damariz Zambarno</p>
          </div>


          <div className="mt-8 gap-3 flex justify-center">
            <a className="inline-flex justify-center items-center 
      gap-x-3 text-center bg-gradient-to-tl from-green-600
       to-white  border border-transparent cursor-pointer px-3 py-2 text-black text-sm font-medium rounded-md "
              href="/dashboard">
              Explora ahora
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </a>

          </div>



        </div>
      </div>


      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-2">

          <a className="group flex flex-col justify-center hover:border-2 hover:border-white rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
            <div className="flex justify-center items-center size-12 bg-black border-white border-2 border-opacity-10 rounded-xl">
              <ImageIcon color="white" className="opacity-50"/>
            </div>
            <div className="mt-5">
              <Subtitle title='Genera miniaturas con IA' className='mb-4' />
              <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">Generame thumbnails en base a tu gusto con solo un prompt, proporciona imagenes de referencia para mas precisión</p>
             
            </div>
          </a>
          <a className="group flex flex-col justify-center hover:border-2 hover:border-white rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
            <div className="flex justify-center items-center size-12 bg-black border-white border-2 border-opacity-10 rounded-xl">
              <Youtube color="white" className="opacity-50"/>
            </div>
            <div className="mt-5">
              <Subtitle title='Busca miniaturas' className='mb-4' />
              <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">Busca miniaturas directamente desde nuestra plataforma la cual esta conectada con youtube para mayor facilidad a la hora de buscar referencias para tus miniaturas</p>
             
            </div>
          </a>
          <a className="group flex flex-col justify-center hover:border-2 hover:border-white rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
            <div className="flex justify-center items-center size-12 bg-black border-white border-2 border-opacity-10 rounded-xl">
              <KeyIcon color="white" className="opacity-50"/>
            </div>
            <div className="mt-5">
              <Subtitle title='Genera KeyWords' className='mb-4' />
              <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">Genera KeyWords con IA y WebScrapping que tengan un alto puntaje de engagement con el fin de tener mas resultados organicos, lo que conlleva a posicionarte en los primeros resultados de las busquedas</p>
             
            </div>
          </a>
          <a className="group flex flex-col justify-center hover:border-2 hover:border-white rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
            <div className="flex justify-center items-center size-12 bg-black border-white border-2 border-opacity-10 rounded-xl">
              <Sheet color="white" className="opacity-50"/>
            </div>
            <div className="mt-5">
              <Subtitle title='Genera Contenido' className='mb-4' />
              <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">Genera contenido con IA, si no dispones de tiempo para crear miniaturas, descripcion y keywords para tus videos aqui te damos la solucion a ese problema con solo un prompt</p>
             
            </div>
          </a>

          

        </div>
      </div>

    </div>
  );
}

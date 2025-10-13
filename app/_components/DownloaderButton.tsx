import { handleDownloadImage } from '@/utils/downloadAction';
import { Download } from 'lucide-react';
import React from 'react'

function DownloaderButton({thumbnailUrl, thumbnailId}: {thumbnailUrl: string, thumbnailId: string}) {
    return (
        <button
            className='bg-black z-10 p-2 rounded-sm absolute right-2 top-2 hover:bg-gray-800'
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownloadImage(thumbnailUrl, thumbnailId);
            }}
        >
            <Download className='text-green-700' height={15} />
        </button>
    )
}

export default DownloaderButton
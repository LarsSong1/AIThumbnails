export const handleDownloadImage = async (url: string, id: string) => {
    try {
        // Fetch la imagen como blob
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Crear URL temporal
        const blobUrl = URL.createObjectURL(blob);
        
        // Crear link y descargar
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `thumbnail-${id}.jpg`; // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL temporal
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error descargando imagen:', error);
        // Fallback: abrir en nueva pestaña
        window.open(url, '_blank');
    }
};
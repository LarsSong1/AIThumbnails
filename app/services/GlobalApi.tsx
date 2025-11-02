

export const RunStatus = async (eventId: string) => {
    try {
        console.log("Checking status for:", eventId);
        
        // ✅ Solo llama a TU API route, no a Inngest directamente
        const response = await fetch(`/api/inngest-status?eventId=${eventId}`);
        
        console.log("Status response:", response);
        
        const data = await response.json();
        console.log("Status data:", data);
        return data;
        
    } catch (error) {
        console.error('Error getting run status:', error);
        return null;
    }
}
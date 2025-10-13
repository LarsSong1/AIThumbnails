// export const RunStatus = async (eventId: string) => {
//     console.log(eventId, "eventId");
//     const baseUrl = process.env.NEXT_PUBLIC_INNGEST_SERVER_URL;
//     console.log(baseUrl, "baseUrl");
//     const response = await fetch(process.env.NEXT_PUBLIC_INNGEST_SERVER_URL + `/v1/events/${eventId}/runs`, {
//         headers: {
//             Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
//         },
//     });
//     const json = await response.json();
//     return json.data;
// }

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
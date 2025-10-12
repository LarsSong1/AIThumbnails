export const RunStatus = async (eventId: string) => {
    console.log(eventId, "eventId");
    const baseUrl = process.env.NEXT_PUBLIC_INNGEST_SERVER_URL;
    console.log(baseUrl, "baseUrl");
    const response = await fetch(process.env.NEXT_PUBLIC_INNGEST_SERVER_URL + `/v1/events/${eventId}/runs`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_INNGEST_SIGNING_KEY}`,
        },
    });
    const json = await response.json();
    return json.data;
}
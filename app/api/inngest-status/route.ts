import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const eventId = req.nextUrl.searchParams.get('eventId');
        
        if (!eventId) {
            return NextResponse.json(
                { error: 'eventId is required' },
                { status: 400 }
            );
        }

        console.log("Fetching Inngest status for:", eventId);

        const inngestUrl = `${process.env.INNGEST_SERVER_URL}/v1/events/${eventId}/runs`;
        console.log("Inngest URL:", inngestUrl);

        const response = await fetch(inngestUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`, // Sin NEXT_PUBLIC_
            },
        });

        if (!response.ok) {
            console.error("Inngest API error:", response.status);
            return NextResponse.json(
                { error: `Inngest API error: ${response.status}` },
                { status: response.status }
            );
        }

        const json = await response.json();
        console.log("Inngest response:", json);
        
        return NextResponse.json(json.data);

    } catch (error: any) {
        console.error('Error in inngest-status route:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
        return NextResponse.json({ error: "Missing url param" }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Site returned ${response.status}` },
                { status: 502 }
            );
        }

        const contentType = response.headers.get("content-type") ?? "";
        const text = await response.text();

        return NextResponse.json({ html: text, contentType });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Fetch failed" },
            { status: 502 }
        );
    }
}
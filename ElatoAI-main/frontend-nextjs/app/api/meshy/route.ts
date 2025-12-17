
import { NextRequest, NextResponse } from "next/server";

const MESHY_API_KEY = process.env.MESHY_API_KEY;
const API_BASE_URL = "https://api.meshy.ai/v2/image-to-3d";

export async function POST(req: NextRequest) {
    if (!MESHY_API_KEY) {
        return NextResponse.json(
            { error: "Meshy API Key not configured" },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Missing imageUrl" },
                { status: 400 }
            );
        }

        const payload = {
            image_url: imageUrl,
            enable_pbr: true,
        };

        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MESHY_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Meshy API Error:", data);
            return NextResponse.json({
                error: data.message || "Unknown Meshy API Error",
                details: data
            }, { status: response.status });
        }

        return NextResponse.json({ result: data.result });
    } catch (error: any) {
        console.error("Meshy Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    if (!MESHY_API_KEY) {
        return NextResponse.json(
            { error: "Meshy API Key not configured" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("task_id");

    if (!taskId) {
        return NextResponse.json({ error: "Missing task_id" }, { status: 400 });
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            headers: {
                Authorization: `Bearer ${MESHY_API_KEY}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Meshy API Error (GET):", data);
            return NextResponse.json({
                error: data.message || "Unknown Meshy API Error",
                details: data
            }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Meshy Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}


import { NextRequest, NextResponse } from "next/server";

const TRIPO_API_KEY = process.env.TRIPO_API_KEY;
const API_BASE_URL = "https://api.tripo3d.ai/v2/openapi";

export async function POST(req: NextRequest) {
    if (!TRIPO_API_KEY) {
        return NextResponse.json(
            { error: "Tripo API Key not configured" },
            { status: 500 }
        );
    }

    try {
        // We expect a JSON body with an 'imageUrl' or 'fileToken'
        const body = await req.json();
        const { imageUrl, fileToken } = body;

        if (!imageUrl && !fileToken) {
            return NextResponse.json(
                { error: "Missing imageUrl or fileToken" },
                { status: 400 }
            );
        }

        const payload: any = {
            type: "image_to_model",
            file: {
                type: imageUrl ? "jpg" : "png", // Simplified type assumption, Tripo usually handles standard extensions
            }
        };

        if (imageUrl) {
            payload.file.url = imageUrl;
        } else {
            payload.file.file_token = fileToken;
        }

        const response = await fetch(`${API_BASE_URL}/task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TRIPO_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Tripo API Error:", data);
            return NextResponse.json({
                error: data.message || data.error || "Unknown Tripo API Error",
                details: data
            }, { status: response.status });
        }

        return NextResponse.json({ task_id: data.data.task_id });
    } catch (error: any) {
        console.error("Tripo Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    if (!TRIPO_API_KEY) {
        return NextResponse.json(
            { error: "Tripo API Key not configured" },
            { status: 500 }
        );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("task_id");

    if (!taskId) {
        return NextResponse.json({ error: "Missing task_id" }, { status: 400 });
    }

    try {
        const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
            headers: {
                Authorization: `Bearer ${TRIPO_API_KEY}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Tripo API Error (GET):", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data.data);
    } catch (error: any) {
        console.error("Tripo Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}


import { NextRequest, NextResponse } from "next/server";

// We expect these in .env.local
const HITEM_ACCESS_KEY = process.env.HITEM_ACCESS_KEY;
const HITEM_SECRET_KEY = process.env.HITEM_SECRET_KEY;
// Updated Base URL based on documentation
const API_BASE_URL = "https://api.hitem3d.ai/open-api/v1";

// Helper to get a token
async function getToken() {
    if (!HITEM_ACCESS_KEY || !HITEM_SECRET_KEY) {
        throw new Error("Hitem3D Credentials not configured");
    }

    // Try /token endpoint (deduced from flow)
    const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            access_key: HITEM_ACCESS_KEY,
            secret_key: HITEM_SECRET_KEY,
        }),
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error("Hitem3D Token Parse Error. Response:", text.substring(0, 200));
        throw new Error("Invalid response from Hitem3D Auth");
    }

    if (!response.ok || data.code !== 0) {
        console.error("Hitem3D Token Error:", data);
        throw new Error(data.msg || "Failed to get Hitem3D token");
    }

    return data.data.token;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
        }

        const token = await getToken();

        // Create Task - API Endpoint updated to /submit-task based on references, or /task
        // Trying /submit-task as seen in python examples
        const payload = {
            type: "image_to_model",
            images: [imageUrl],
        };

        const response = await fetch(`${API_BASE_URL}/submit-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Hitem3D Task Parse Error:", text.substring(0, 200));
            // Retry strategy or specific error could go here, but for now reporting context
            return NextResponse.json({ error: "Invalid API response from Hitem3D Task" }, { status: 502 });
        }

        if (!response.ok || data.code !== 0) {
            console.error("Hitem3D Create Task Error:", data);
            return NextResponse.json({
                error: data.msg || "Unknown Hitem3D Error",
                details: data
            }, { status: response.status || 500 });
        }

        return NextResponse.json({ task_id: data.data.id });

    } catch (error: any) {
        console.error("Hitem Route Post Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("task_id");

    if (!taskId) {
        return NextResponse.json({ error: "Missing task_id" }, { status: 400 });
    }

    try {
        const token = await getToken();

        const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Hitem3D Get Task Parse Error:", text.substring(0, 200));
            return NextResponse.json({ error: "Invalid API response from Hitem3D Status" }, { status: 502 });
        }

        if (!response.ok || data.code !== 0) {
            console.error("Hitem3D Get Task Error:", data);
            return NextResponse.json({
                error: data.msg || "Unknown Hitem3D Error",
                details: data
            }, { status: response.status || 500 });
        }

        return NextResponse.json(data.data);

    } catch (error: any) {
        console.error("Hitem Route Get Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}


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

    // specific endpoint for token with Basic Auth
    const authString = Buffer.from(`${HITEM_ACCESS_KEY}:${HITEM_SECRET_KEY}`).toString('base64');

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${authString}`
        },
    });

    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error("Hitem3D Token Parse Error. Response:", text.substring(0, 200));
        throw new Error("Invalid response from Hitem3D Auth");
    }

    if (!response.ok || (data.code !== 0 && data.code !== 200)) { // Checking both standard code 0 and HTTP 200 just in case
        console.error("Hitem3D Token Error:", data);
        throw new Error(data.msg || "Failed to get Hitem3D token");
    }

    // Documentation says response contains accessToken
    // Some docs say data.data.token, others say data.data.accessToken. 
    // Let's try to be robust.
    return data.data?.token || data.data?.accessToken;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
        }

        const token = await getToken();

        // Download the image first
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to download image from Supabase: ${imageResponse.statusText}`);
        }
        const imageBlob = await imageResponse.blob();

        // Create FormData
        const formData = new FormData();
        // Append file - explicit filename and type usually helps APIs
        formData.append("images", imageBlob, "input_image.png");
        formData.append("request_type", "3");

        // Economy Settings to avoid "insufficient balance" on potential Pro features
        formData.append("face", "300000");   // Lower face count
        formData.append("resolution", "512"); // Standard resolution
        formData.append("model", "hitem3dv1"); // Standard model (v1 instead of v1.5)

        const response = await fetch(`${API_BASE_URL}/submit-task`, {
            method: "POST",
            headers: {
                // Do NOT set Content-Type here; fetch sets it with boundary for FormData
                Authorization: `Bearer ${token}`,
            },
            body: formData,
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

        if (!response.ok || (data.code !== 0 && data.code !== 200)) {
            console.error("Hitem3D Create Task Error:", data);
            return NextResponse.json({
                error: data.msg || data.message || "Unknown Hitem3D Error",
                details: data
            }, { status: response.status !== 200 ? response.status : 400 });
        }

        const returnedId = data.data?.id || data.data?.task_id || data.data?.taskId || data.id || data.taskId;

        if (!returnedId) {
            console.error("Hitem3D POST Task ID missing in response:", data);
            return NextResponse.json({
                error: "Task ID missing in upstream response",
                details: data
            }, { status: 502 });
        }

        return NextResponse.json({ task_id: returnedId });

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

        if (!response.ok || (data.code !== 0 && data.code !== 200)) {
            console.error("Hitem3D Create Task Error:", data);
            return NextResponse.json({
                error: data.msg || data.message || "Unknown Hitem3D Error",
                details: data
            }, { status: response.status !== 200 ? response.status : 400 });
        }

        const returnedId = data.data?.id || data.data?.task_id || data.data?.taskId || data.id || data.taskId;

        if (!returnedId) {
            console.error("Hitem3D Task ID missing in response:", data);
            return NextResponse.json({
                error: "Task ID missing in upstream response",
                details: data
            }, { status: 502 });
        }

        return NextResponse.json({ task_id: returnedId });

    } catch (error: any) {
        console.error("Hitem Route Get Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

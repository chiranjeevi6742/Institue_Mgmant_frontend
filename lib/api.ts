const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchHealthCheck() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) throw new Error("Backend not healthy");
        return await response.json();
    } catch (error) {
        console.error("API Health Check Failed:", error);
        return { status: "error" };
    }
}

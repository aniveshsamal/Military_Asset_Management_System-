const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    "https://military-asset-management-system-a03q.onrender.com/api"
).replace(/\/$/, "");

async function apiRequest(
    endpoint,
    options = {}
) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token && !endpoint.startsWith("/auth/")) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const responseText = await response.text();

    let data = {};

    if (responseText && contentType.includes("application/json")) {
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error("Invalid JSON response from server");
        }
    } else if (responseText) {
        data = {
            message: responseText
        };
    }

    if (!response.ok) {
        throw new Error(
            data.message || `Request failed with status ${response.status}`
        );
    }

    return data;
}

export default apiRequest;
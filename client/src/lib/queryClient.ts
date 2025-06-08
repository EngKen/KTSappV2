import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const fullUrl = `${API_BASE_URL}${url}`;
  console.log('Making request to:', fullUrl); // Debug log

  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      "Accept": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    mode: "cors",
    credentials: "include",
  });

  console.log('Response status:', res.status); // Debug log
  const responseText = await res.text();
  console.log('Response text:', responseText); // Debug log

  if (!res.ok) {
    throw new Error(`${res.status}: ${responseText}`);
  }

  // Create a new Response with the text content
  return new Response(responseText, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const fullUrl = `${API_BASE_URL}${queryKey[0] as string}`;
    console.log('Making query request to:', fullUrl); // Debug log

    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
      mode: "cors"
    });

    console.log('Query response status:', res.status); // Debug log
    const responseText = await res.text();
    console.log('Query response text:', responseText); // Debug log

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`${res.status}: ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { authClient } from "@/lib/auth-client";

function resolveApiBaseUrl(): string {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fallback = "http://localhost:4000/api";

  if (typeof window === "undefined") {
    return envBase ?? fallback;
  }

  const runtimeHost = window.location.hostname;
  const candidate = envBase ?? fallback;

  try {
    const u = new URL(candidate);
    if (u.hostname === "localhost" && runtimeHost !== "localhost") {
      u.hostname = runtimeHost;
      return u.toString().replace(/\/$/, "");
    }
    return candidate;
  } catch {
    return candidate;
  }
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: resolveApiBaseUrl(),
  prepareHeaders: (headers) => headers
});

export const baseApi = createApi({
  reducerPath: "rqmsApi",
  baseQuery: async (args, api, extraOptions) => {
    // Retrieve a short-lived JWT from Better Auth to call the Nest API.
    const tokenRes = await authClient.token();
    if (tokenRes.error) {
      return { error: { status: 401, data: { message: "Not authenticated" } } } as any;
    }

    const token = tokenRes.data?.token;
    const argsWithAuth =
      typeof args === "string"
        ? { url: args, headers: { Authorization: `Bearer ${token}` } }
        : {
            ...args,
            headers: {
              ...(args.headers as any),
              Authorization: `Bearer ${token}`
            }
          };

    return rawBaseQuery(argsWithAuth as any, api, extraOptions);
  },
  endpoints: () => ({})
});

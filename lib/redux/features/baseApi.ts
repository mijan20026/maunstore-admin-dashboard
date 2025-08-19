import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.7.111:5003/api/v1", // Change this to your server URL
    prepareHeaders: (headers: Headers) => {
      // Add the token to the headers if available
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Will be extended with endpoints
});

// Exporting image URL separately for reuse in components
export const imageUrl = "http://10.10.7.111:5003";

import axios from "axios";
import { toast } from "@/hooks/use-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  timeout: 12000, // 12s — covers Vercel cold start, fails fast instead of hanging
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// Turns any axios failure into one sentence a user can act on. The server's own
// message wins when it sent one, since it knows what actually went wrong.
function describeError(error) {
  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. It may be waking up — try again in a moment.";
  }

  if (!error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const { status, data } = error.response;

  if (data?.message) return data.message;

  switch (status) {
    case 400:
      return "That request wasn't valid. Please check the details and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 402:
      return "The payment couldn't be confirmed.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 503:
      return "The service is temporarily unavailable. Please try again shortly.";
    default:
      return `Something went wrong (error ${status}). Please try again.`;
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = describeError(error);
    const { config, response } = error;
    const method = config?.method?.toUpperCase() || "?";
    const url = `${config?.baseURL || ""}${config?.url || ""}`;

    // One console line per failure with everything needed to debug it: which
    // call, what the server said, and the payload we sent.
    console.error(
      `[API] ${method} ${url} failed${response ? ` (${response.status})` : ""}: ${message}`,
      {
        status: response?.status,
        serverResponse: response?.data,
        requestBody: config?.data,
        code: error.code,
      }
    );

    // Callers that render their own error UI opt out with { silentError: true }.
    if (!config?.silentError) {
      toast({
        title: "Something went wrong",
        description: message,
        variant: "destructive",
      });
    }

    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default axiosInstance;

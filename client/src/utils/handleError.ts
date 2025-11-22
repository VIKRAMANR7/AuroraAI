import toast from "react-hot-toast";
import axios from "axios";

export function handleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error("Something went wrong");
}

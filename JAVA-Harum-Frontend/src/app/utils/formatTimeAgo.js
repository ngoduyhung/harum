/* eslint-disable no-unused-vars */
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  } catch (error) {
    console.error("Invalid date string for formatTimeAgo:", dateString);
    return dateString;
  }
};

export default formatTimeAgo;

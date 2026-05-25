/* eslint-disable no-unused-vars */
export default function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (err) {
    return "01-05-2025";
  }
}

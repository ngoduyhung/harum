import axios from "axios";
import { API_URL } from "../../../bkUrl";

export const getSearchResult = async (keyword, page = 1, size = 10) => {
  try {
    const res = await axios.get(
      `${API_URL}/search/all?keyword=${keyword}&page=${page}&size=${size}`
    );
    console.log("search này: ", res);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi search:", error);
    return error;
  }
};

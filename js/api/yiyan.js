import axios from "axios";

const API = "https://v1.hitokoto.cn/?c=f&encode=text";

export default {
  getYiyan: () => {
    return axios.get(API);
  }
};

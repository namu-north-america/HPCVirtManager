import axios from "axios";


const prometheusApi = async (
  method,
  urlEndPoint,
  data = {},
) => {
  try {
    let headers = {
      "Content-Type": "application/json",
    };
  

    let response = await axios({
      method,
      url:  '/server1'+urlEndPoint,
      data,
      headers,
    });

    let res = response.data;

    return res;
  } catch (error) {
    return error;
  }
};



export default prometheusApi;

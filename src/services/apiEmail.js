import axios from "axios";


const apiEmail = async (
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
      url:  'http://localhost:3001'+urlEndPoint,
      data,
      headers,
    });

    let res = response.data;

    return res;
  } catch (error) {
    return error;
  }
};



export default apiEmail;

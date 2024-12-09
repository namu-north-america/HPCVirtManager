//const baseUrl = "http://15.157.153.228:32023";
const baseUrl = "http://52.156.107.111:32048";
const endPointUrl = baseUrl;

export const cacheOptions = [
  {
    name: "Automatic",
    value: "automatic",
  },
  {
    name: "None",
    value: "none",
  },
  {
    name: "WriteThrough",
    value: "writethrough",
  },
  {
    name: "WriteBack",
    value: "writeback",
  },
];

const constants = { baseUrl, endPointUrl, cacheOptions };

export default constants;

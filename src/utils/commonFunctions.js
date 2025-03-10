import { entries, notEqual, values } from "./javascript";
import formValidation from "./validations";
import constants from "../constants";


const showFormErrors = (data, setData, ignore = []) => {
  let formErrors = data.formErrors || {};

  entries(data).forEach(([key, value]) => {
    if (!ignore.includes(key)) {
      formErrors = {
        // ...formErrors,
        ...formValidation(key, value, { formErrors }, ignore),
      };
    }
  });
  console.log(formErrors);
  setData({ ...data, formErrors });
  return !values(formErrors).some((v) => notEqual(v, ""));
};


const capitalizeCamelCase = (str) => {
  let words = str?.split(/(?=[A-Z])/) || [];
  let capitalizedWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  let capitalizedString = capitalizedWords.join(" ");
  return capitalizedString;
};


const getImageUrl = (image) => {
  if (image.includes("http")) {
    return image;
  } else {
    return constants.baseUrl + image;
  }
};


function convertKiToMBorGB(input) {
  let kibibytes;
  if (typeof input === "string" && input.includes("Ki")) {
    kibibytes = parseInt(input.replace("Ki", "").trim());
  } else {
    kibibytes = parseInt(input);
  }
  let mebibytes = kibibytes / 1024;
  if (mebibytes >= 1024) {
    let gibibytes = mebibytes / 1024;
    return `${gibibytes.toFixed(2)} GiB`;
  } else {
    return `${mebibytes.toFixed(2)} MiB`;
  }
}


function bytesToGB(bytes) {
  const gb = bytes / 1024 ** 3; // 1 GB = 1024^3 bytes
  return gb.toFixed(2); // Rounds to 2 decimal places
}


function splitMemoryString(string = "") {
  const result = string.match(/(\d+)([A-Za-z]+)/);
  const size = result?.[1]; // "10"
  const memoryType = result?.[2];
  return { size, memoryType };
}


// permissions.js
const hasPermission = (permissions, requiredPermission) => {
  if (permissions.hasOwnProperty(requiredPermission) && permissions.requiredPermission === true) {
    return true;
  } else {
    return false;
  }
};


const filterNamespacesByCrudVMS = (namespaces, data) => {
  const result = [];
  // Loop through the data to find matching namespaces
  for (const entry of data) {
    if (
      namespaces.includes(entry.namespace) && // Check if the namespace is in the list
      entry.crudVMS === "yes" // Check if crudVMS is "yes"
    ) {
      result.push(entry);
    }
  }
  return result;
};


const filterNamespacesBycrudDataVolume = (namespaces, data) => {
  const result = [];
  // Loop through the data to find matching namespaces
  for (const entry of data) {
    if (
      namespaces.includes(entry.namespace) && // Check if the namespace is in the list
      entry.crudDataVolume === "yes" // Check if crudDataVolume is "yes"
    ) {
      result.push(entry);
    }
  }
  return result;
};


const filterNamespacesByCrudImages = (namespaces, data) => {
  const result = [];
  // Loop through the data to find matching namespaces
  for (const entry of data) {
    if (
      namespaces.includes(entry.namespace) && // Check if the namespace is in the list
      entry.crudImage === "yes" // Check if crudVMS is "yes"
    ) {
      result.push(entry);
    }
  }
  return result;
};


const checkNamespaceValue = (data, namespaceName, key) => {
  // Find the object that matches the given namespace
  const namespaceObject = data.find((item) => item.namespace === namespaceName);
  // If the namespace exists and the key is present, check if its value is 'yes'
  if (namespaceObject && key in namespaceObject) {
    return namespaceObject[key] === "yes";
  }
  // If namespace or key doesn't exist, return false
  return false;
};


export {
  filterNamespacesByCrudVMS,
  filterNamespacesBycrudDataVolume,
  filterNamespacesByCrudImages,
  hasPermission,
  checkNamespaceValue,
  capitalizeCamelCase,
  showFormErrors,
  getImageUrl,
  convertKiToMBorGB,
  bytesToGB,
  splitMemoryString,
};

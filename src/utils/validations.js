import {
  FirstletterUpperCase,
  equal,
  greaterThan,
  length,
  notEqual,
} from "./javascript";
import {
  firstLetterToUppercase,
  stringValidation,
  emailValidation,
  regularString,
} from "./regex";

const formValidation = (name, value, state, ignore = []) => {
  const formErrors = { ...state?.formErrors };
  if (ignore.includes(name)) {
    if (formErrors[name]) formErrors[name] = "";
    return formErrors;
  }
  switch (name) {
    case "clusterPermission":
    case "namespacePermission":
    case "permissionGranted":
    case "email":
    case "businessEmail":
      if (equal(length(value))) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (!emailValidation(value)) {
        formErrors[name] = `Please enter valid email!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "fullName":
    case "userName":
    case "size":
    case "namespace":
    case "node":
    case "storageClass":
    case "accessMode":
    case "disk":
      if (equal(length(value))) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (!regularString(value)) {
        formErrors[name] = `Unnecessary space or special chracter in word!`;
      } else if (greaterThan(length(value), 70)) {
        formErrors[name] = `${firstLetterToUppercase(
          name
        )} exceeds character limit. Maximum allowed: 70 characters.`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "url":
      if (equal(length(value))) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (!regularString(value)) {
        formErrors[name] = `Unnecessary space in url!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "firstName":
    case "lastName":
    case "name":
    case "sockets":
    case "cores":
    case "threads":
    case "memory":
    case "priorityClass":
      if (equal(length(value))) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (!stringValidation(value)) {
        formErrors[name] = `Unnecessary space or special chracter in word!`;
      } else {
        formErrors[name] = "";
      }
      break;
    case "password":
      if (equal(length(value))) {
        formErrors[name] = `${FirstletterUpperCase(name)} is required!`;
      } else {
        formErrors[name] = "";
      }
      break;

    case "confirmPassword":
      if (equal(length(value))) {
        formErrors[name] = `${firstLetterToUppercase(name)} is required!`;
      } else if (notEqual(state.password, value)) {
        formErrors[name] = `Password and Confirm Password is not match!`;
      } else if (equal(state.password, value)) {
        formErrors[name] = "";
      }
      break;

    case "clusterPermission":
    default:
      break;
  }
  return formErrors;
};

export default formValidation;

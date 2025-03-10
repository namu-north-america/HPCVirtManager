import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";


/*
 * custom hook to manage namespace access without filtering - returns the full
 * namespacesDropdown from redux state.project
 * @returns {array} full list of namespaces
 */
export const useHasAccess = () => {
  const [namespace, setNamespace] = useState([]);
  const { namespacesDropdown } = useSelector((state) => state.project);

  const hasAccess = useCallback(() => {
    // console.log("useHasAccess : full namespaces list :", namespacesDropdown);
    setNamespace(namespacesDropdown);
  }, [namespacesDropdown]);

  useEffect(() => {
    hasAccess();
  }, [hasAccess]);

  return namespace;
};

import React from "react";
import CustomModal from "../../../shared/CustomModal";

export default function HotPlugModal({ isOpen, setVisible, ...rest }) {
  return <CustomModal visible={isOpen} setVisible={setVisible} {...rest}></CustomModal>;
}

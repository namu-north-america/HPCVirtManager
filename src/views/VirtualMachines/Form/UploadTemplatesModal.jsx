import React, { useState, useEffect, useRef } from "react";
import "./UploadTemplatesModal.scss";
import Modal from "../../../shared/Modal/Modal";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocalStorage } from "primereact/hooks";
import Yaml from "js-yaml";
import { useDispatch } from "react-redux";
import { setSelectedTemplate } from "../../../store/slices/vmSlice";
import classnames from "classnames";

export default function UploadTemplatesModal({ isOpen, onClose }) {
  const [store, setStore] = useLocalStorage("", "yaml-file");
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [showProgress, setShowProgress] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [status, setStatus] = useState("");
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");
  const timeoutRef = useRef();
  const dispatch = useDispatch();

  const openFilesWindow = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    let selectedFiles = event.dataTransfer ? event.dataTransfer.files : event.target.files;

    setFile(selectedFiles[0]);
  };

  const createProgressTimeout = (nextStatus, next) => {
    timeoutRef.current = setTimeout(() => {
      setShowProgress(false);
      setStatus(nextStatus);
      next && next();
    }, 1600);
  };

  const onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    handleFileChange(e);
    setIsDragOver(false);
  };

  const onDragOver = (e) => {
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const onDragEnter = (e) => {
    e.dataTransfer.dropEffect = "copy";
    e.stopPropagation();
    e.preventDefault();
  };

  const onDragLeave = (e) => {
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(false);
  };

  const onImport = () => {
    setShowProgress(true);
    setProgressText("Importing in progress...");
    dispatch(setSelectedTemplate({ template: store }));
    createProgressTimeout("import-success");
  };

  useEffect(() => {
    if (file) {
      setShowProgress(true);
      setProgressText("Uploading...");

      if (file.size > 50 * 1024 * 1024) {
        createProgressTimeout("upload-failed", () => setError("File size exceeded (max 50BM)"));

        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const yamlContent = Yaml.load(reader.result);
          console.log("Parsed YAML content:", yamlContent);
          setStore(reader.result);
          createProgressTimeout("upload-success");
        } catch (err) {
          console.error("Invalid YAML file:", err.message);
          createProgressTimeout("upload-failed", () => setError(`Invalid file format (${file.name})`));
        }
      };

      reader.readAsText(file);
    }
  }, [file]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  let uploaderContent;

  if (showProgress) {
    uploaderContent = (
      <div className="progress-view">
        <ProgressSpinner
          strokeWidth={4}
          animationDuration="3s"
          pt={{ circle: "progress-spinner-circle ", spinner: "progress-spinner" }}
        />
        <h4>{progressText}</h4>
      </div>
    );
  } else if (status === "upload-success" || status === "import-success") {
    uploaderContent = (
      <div className="success-view">
        <i className="pi pi-check border-circle"></i>
        <h4>{status === "upload-success" ? "File uploaded successfully!" : "File imported successfully!"}</h4>
        <span className="status-sub">{file.name}</span>
        {status == "upload-success" && (
          <Button
            label="Import Now"
            icon="pi pi-file-import"
            pt={{ root: { className: "button" } }}
            onClick={onImport}
          />
        )}
      </div>
    );
  } else if (status === "upload-failed") {
    uploaderContent = (
      <div className="failed-view">
        <i className="pi pi-times border-circle"></i>
        <h4>Failed to upload the file</h4>
        <span className="status-sub error-text">{error}</span>
        <Button
          label="Try Again"
          icon="pi pi-sync"
          pt={{ root: { className: "button" } }}
          onClick={() => setStatus("")}
        />
      </div>
    );
  } else {
    uploaderContent = (
      <div className="upload-view">
        <Button icon="pi pi-upload" severity="info" rounded className="upload-button" onClick={openFilesWindow} />
        <h3>
          Drop your .yaml file here or <a>browse</a>
        </h3>
        <span className="size">Maximum size: 50MB</span>
        <input ref={fileInputRef} type="file" className="file-input" accept=".yml,.yaml" onChange={handleFileChange} />
      </div>
    );
  }

  const uploaderProps = {
    className: classnames("uploader", {
      "drag-over": isDragOver,
      "in-progress": showProgress,
      error: status == "upload-failed",
    }),
    onDrop: onDrop,
    onDragOver: onDragOver,
    onDragEnter: onDragEnter,
    onDragLeave: onDragLeave,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="upload-modal"
      title="Import a YAML file"
      subtitle={
        <span>
          For a smooth import please <a>download and use our sample .yaml file as a template.</a> This will help avoid
          errors by ensuring your file meets Cocktail Virt's requirements.
        </span>
      }
    >
      <div className="content">
        <div {...uploaderProps}>{uploaderContent}</div>
      </div>
    </Modal>
  );
}

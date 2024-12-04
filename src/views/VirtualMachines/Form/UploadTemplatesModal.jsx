import React, { useState, useEffect, useRef } from "react";
import "./UploadTemplatesModal.scss";
import Modal from "../../../shared/Modal/Modal";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import Yaml from "js-yaml";

export default function UploadTemplatesModal({ isOpen, onClose }) {
  const fileInputRef = useRef();
  const [file, setFile] = useState();
  const [showUploadProgress, setShowUploadProgress] = useState(false);

  const openFilesWindow = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    let selectedFiles = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    console.log("onFilechange______", selectedFiles);
    setFile(selectedFiles[0]);
  };

  const onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    handleFileChange(e);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowUploadProgress(false);
    }, 1000);

    if (file) {
      setShowUploadProgress(true);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const yamlContent = Yaml.load(reader.result);
          console.log("Parsed YAML content:", yamlContent);
        } catch (err) {
          console.error("Invalid YAML file:", err.message);
        }
      };
      reader.readAsText(file);
    }
    return () => clearTimeout(timeout);
  }, [file]);

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
        <div
          className="uploader"
          onDrop={onDrop}
          onDragOver={(e) => {
            e.dataTransfer.dropEffect = "copy";
            e.stopPropagation();
            e.preventDefault();
          }}
          onDragEnter={(e) => {
            e.dataTransfer.dropEffect = "copy";
            e.stopPropagation();
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.dataTransfer.dropEffect = "copy";
          }}
        >
          {showUploadProgress ? (
            <>
              <ProgressSpinner
                strokeWidth={4}
                animationDuration="3s"
                pt={{ circle: "progress-spinner-circle ", spinner: "progress-spinner" }}
              />
              <h4>Uploading...</h4>
            </>
          ) : (
            <>
              <Button icon="pi pi-upload" severity="info" rounded className="upload-button" onClick={openFilesWindow} />
              <h3>
                Drop your .yaml file here or <a>browse</a>
              </h3>
              <span className="size">Maximum size: 50MB</span>
              <input
                ref={fileInputRef}
                type="file"
                className="file-input"
                accept=".yml,.yaml"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

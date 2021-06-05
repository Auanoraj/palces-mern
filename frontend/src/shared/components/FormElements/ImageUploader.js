import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

import "../../styles/FormElements/ImageUploader.css";

const ImageUploader = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;
    else {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };

      fileReader.readAsDataURL(file);
    }
  }, [file]);

  const pickedHandler = async (e) => {
    let { files } = e.target,
      pickedFile,
      isFileValid;

    if (files.length === 1) {
      pickedFile = files[0];
      setFile(files[0]);
      setIsValid(true);
      isFileValid = true;
    } else {
      setIsValid(false);
      isFileValid = false;
    }

    props.onInput("image", pickedFile, isFileValid);
  };

  const pickcImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        ref={filePickerRef}
        type="file"
        style={{ display: "none" }}
        id={props.id}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickcImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUploader;

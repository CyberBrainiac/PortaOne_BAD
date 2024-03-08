import { useCallback, useState } from "react";
import PropTypes from 'prop-types';
import { useDropzone } from "react-dropzone";
import "./dropzone.scss";

const Dropzone = ({ onUpload }) => {
  const [file, setFile] = useState(undefined);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);
      onUpload(file);
    },
    [onUpload, setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/x-bzip2": [".bz2"],
    },
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="dropzone__message">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            <p>Drag and drop some files here, or click to select files</p>
            <p>Only *.txt and *.bz2 file will be accepted</p>
          </>
        )}
      </div>
      <div className="dropzone__accepted">{file && <p>Loaded file: {file.name}</p>}</div>
    </div>
  );
};

Dropzone.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default Dropzone;

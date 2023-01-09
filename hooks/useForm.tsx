import { ChangeEvent, useEffect, useState } from "react";

const errMessages = {
  required: "field is required",
};

const allowedFileTypes = [
  "image/gif",
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/json",
];

const useForm = (initialState: any = {}, onSubmit: (value: any) => void) => {
  const [formData, setFormData] = useState(initialState);
  const [fileData, setFileData] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let fileType = file.type;
      if (!allowedFileTypes.includes(fileType)) {
        setErrors((prevState: any) => ({
          ...prevState,
          file: `File Type is not allowed`,
        }));
        setFileData(null);
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setFileData(
              Buffer.from(reader.result as ArrayBuffer).toString("hex")
            );
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleInputChange = (e: any) => {
    if (e.target.type === "file") {
      onFileChange(e);
    }
    setErrors((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value
        ? ``
        : `${e.target.name} ${errMessages.required}`,
    }));

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let formFilled = true;
    for (const property in formData) {
      if (!formData[property]) {
        formFilled = false;
        setErrors((prevState: any) => ({
          ...prevState,
          [property]: `${property} ${errMessages.required}`,
        }));
      }
    }
    if (!errors.file && formFilled) {
      setErrors({});
      onSubmit?.(formData);
    }
  };

  const resetForm = () => {
    // if (fileRef.current) {
    //   fileRef.current.value = "";
    // }
    setFileData(null);
    for (const property in formData) {
      setFormData({ ...formData, [property]: "" });
    }
  };

  return {
    formData,
    fileData,
    setFileData,
    handleInputChange,
    handleSubmit,
    resetForm,
    errors,
  };
};
export default useForm;

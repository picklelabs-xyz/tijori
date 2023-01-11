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
  const [errors, setErrors] = useState<any>({});

  const checkForFileErrors = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, [e.target.name]: file });

    if (file) {
      let fileType = file.type;
      setErrors((prevState: any) => ({
        ...prevState,
        file: !allowedFileTypes.includes(fileType)
          ? `File Type is not allowed`
          : "",
      }));
    }
  };

  const handleInputChange = (e: any) => {
    if (e.target.type === "file") {
      checkForFileErrors(e);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setErrors((prevState: any) => ({
        ...prevState,
        [e.target.name]: e.target.value
          ? ``
          : `${e.target.name} ${errMessages.required}`,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    for (const property in formData) {
      setFormData({ ...formData, [property]: "" });
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    errors,
  };
};
export default useForm;

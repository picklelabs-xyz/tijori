import { ChangeEvent, useEffect, useState } from "react";

const errMessages = {
  required: "field is required",
};

const useForm = (initialState: any = {}, onSubmit: (value: any) => void) => {
  const [formData, setFormData] = useState(initialState);
  const [fileData, setFileData] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
  };

  const handleInputChange = (e: any) => {
    if (e.target.type === "file") {
      onFileChange(e);
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    for (const property in formData) {
      setFormData({ ...formData, [property]: "" });
    }
    onSubmit?.(formData);
  };

  const resetForm = (fileRef: any) => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setFileData(null);
    for (const property in formData) {
      setErrors((prevState: any) => ({
        ...prevState,
        [property]: `${property} ${errMessages.required}`,
      }));
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

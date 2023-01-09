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
      if (!formData[property]) {
        setErrors((prevState: any) => ({
          ...prevState,
          [property]: `${property} ${errMessages.required}`,
        }));
      }
    }
    onSubmit?.(formData);
  };

  useEffect(() => {
  }, [errors]);

  return {
    formData,
    fileData,
    setFileData,
    handleInputChange,
    handleSubmit,
    errors,
  };
};
export default useForm;

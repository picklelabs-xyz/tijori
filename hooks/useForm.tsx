import { ChangeEvent, useState } from "react";

const errMessages = {
  required: "field is required",
};

const allowedFileTypes = ["image/gif", "image/png", "image/jpeg"];

const useForm = <T,>(initialState: T, onSubmit: () => void) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<any>({});

  const checkForFileErrors = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, [e.target.name]: file });

    if (file) {
      setErrors((prevState: any) => ({
        ...prevState,
        file: !allowedFileTypes.includes(file.type)
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
      onSubmit();
    }
  };

  const resetForm = () => {
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

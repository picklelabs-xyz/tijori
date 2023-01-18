import { ChangeEvent, useState } from "react";

const errMessages = {
  required: "field is required",
};

const allowedFileTypes = ["image/gif", "image/png", "image/jpeg"];
const allowedFileSize = 60000;
/*TODO:
 * - Refactor error handing ✅ 
 * - type interface for errors
 * - upload size validation ✅ 
 * - remove description from required field
 * - handle sdk errors - lit & bundlr
 */
const useForm = <T,>(initialState: T, onSubmit: () => void) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<any>({});

  const checkForErrors = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.type === "file") {
      const file = (e as ChangeEvent<HTMLInputElement>).target.files?.[0];

      if (file) {
        console.log(file.size)
        let errorMessage = "";

        if (!allowedFileTypes.includes(file.type)){
          errorMessage = `File Type is not allowed`
        } else if (file.size > allowedFileSize) {
          errorMessage = `File cannot be larger than ${allowedFileSize/1000}KB`
        }

        setErrors((prevState: any) => ({
          ...prevState,
          file: errorMessage
        }));
      }
    } else {
      setErrors((prevState: any) => ({
        ...prevState,
        [e.target.name]: e.target.value
          ? ``
          : `${e.target.name} ${errMessages.required}`,
      }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    checkForErrors(e);

    if (e.target.type === "file") {
      const file = (e as ChangeEvent<HTMLInputElement>).target.files?.[0];
      setFormData({ ...formData, [e.target.name]: file });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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

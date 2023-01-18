import { FC, InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  error: string;
  label: string;
}

const inputStyle =
  "w-full mt-1 bg-gray-50 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-200 align-top";

const Input: FC<InputProps> = ({ error, label, ...rest }) => {
  return (
    <>
      <label className="text-gray-700">{label}</label>
      {rest.type === "text" && <input {...rest} className={`${inputStyle}`} />}
      {rest.type === "textarea" && (
        <textarea {...rest} className={`${inputStyle}`}></textarea>
      )}
      {rest.type === "file" && (
        <input
          {...rest}
          className="w-full mt-1 form-input bg-gray-50  border-gray-200 focus:ring-0 focus:border-blue-100"
        />
      )}
      <p className="text-red-500 italic font-extralight">{error && error}</p>
    </>
  );
};

export default Input;

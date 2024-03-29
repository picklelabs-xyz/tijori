interface ButtonProps {
  loading?: boolean;
  type: "button" | "submit" | "reset";
}

const Button = ({ loading, type = "button" }: ButtonProps) => {
  return (
    <button
      disabled={loading}
      type={type}
      className="btn btn-blue inline-flex items-center justify-center disabled:opacity-50"
    >
      {loading && (
        <svg
          className="w-5 h-5 text-white animate-spin mr-1"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {loading ? "Processing..." : "Upload"}
    </button>
  );
};

export default Button;

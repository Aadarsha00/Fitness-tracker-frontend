/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import { Controller } from "react-hook-form";
import { FaVenusMars } from "react-icons/fa";

interface IProps {
  control: any;
  error?: any;
}

const Gender: React.FC<IProps> = ({ control, error }) => {
  const options = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Others", value: "Others" },
  ];

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "48px",
      paddingLeft: "40px",
      backgroundColor: "#f9fafb",
      borderColor: error ? "#ef4444" : "#d1d5db",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#9ca3af",
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#e5e7eb"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#1f2937",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="mb-5">
      <label
        htmlFor="gender"
        className="text-sm font-medium text-gray-700 block mb-1"
      >
        Gender
      </label>
      <div className="relative">
        <span className="absolute left-3 top-3.5 text-gray-400 z-10">
          <FaVenusMars />
        </span>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              id="gender"
              placeholder="Select your gender"
              styles={customStyles}
              value={options.find((option) => option.value === field.value)}
              onChange={(option) => field.onChange(option?.value)}
              options={options}
              className={`react-select-container ${
                error ? "react-select--error" : ""
              }`}
              classNamePrefix="react-select"
            />
          )}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium">{error.message}</p>
      )}
    </div>
  );
};

export default Gender;

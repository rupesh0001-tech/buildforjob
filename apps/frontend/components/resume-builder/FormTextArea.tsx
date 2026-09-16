import React from "react";

interface FormTextAreaProps {
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormTextArea = ({
  name,
  label,
  value,
  placeholder,
  rows = 6,
  onChange,
}: FormTextAreaProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white resize-none text-sm"
      />
    </div>
  );
};

export default FormTextArea;

interface InputComponentProps {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export default function InputComponent ({ label, value, onChange, required }: InputComponentProps) {
  return (
    <div className="flex flex-col space-y-1 mb-4">
      <label className="text-sm font-semibold ">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-plyrColor text-gray-700"
        required={required}
      />
    </div>
  )
}

import { useEffect, useState } from 'react'

interface InputComponentProps {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  validate?: (value: string) => string
  required?: boolean
}

export default function InputComponent({
  label,
  value,
  onChange,
  validate,
  required,
}: InputComponentProps) {
  const [error, setError] = useState('')

  useEffect(() => {
    if (validate !== undefined) {
      const messageError = validate(value)
      setError(messageError)
    }
  }, [value, validate])
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold ">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-plyrColor text-gray-700 ${error !== '' ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
        required={required}
      />

      {error !== undefined && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}

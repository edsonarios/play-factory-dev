import { useState } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface Options {
  name: string
  value: string
}
interface DropDownComponentProps {
  label: string
  value: Options
  setValue: React.Dispatch<React.SetStateAction<Options>>
  options: Options[]
}

export default function DropDownComponent({
  label,
  value,
  setValue,
  options,
}: DropDownComponentProps) {
  const [showOptions, setShowOptions] = useState(false)
  return (
    <div className="relative inline-block -top-1.5 w-32">
      <label className="text-sm font-semibold">{label}</label>
      <button
        className="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        onClick={(event) => {
          event.preventDefault()
          setShowOptions(!showOptions)
        }}
      >
        <span className="block truncate text-gray-700">{value.name}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-700"
            aria-hidden="true"
          />
        </span>
      </button>

      {showOptions && (
        <div className="absolute bottom-full w-full bg-white border border-gray-300 rounded shadow-lg transform -translate-x-1/2 left-1/2 text-slate-900 opacity-90">
          {options.map((option) => (
            <div
              key={option.name}
              className="px-4 py-2 hover:bg-[#afe5fc] hover:text-blue-400 cursor-pointer"
              onClick={() => {
                setValue(option)
                setShowOptions(false)
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

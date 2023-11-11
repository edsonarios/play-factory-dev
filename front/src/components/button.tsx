interface ButtonComponentProps {
  label: string
  onClick: () => void
}

export default function ButtonComponent ({ label, onClick }: ButtonComponentProps) {
  return (
    <button
      onClick={onClick}
      className="bg-plyrColor hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md text-sm mr-2"
    >
      {label}
    </button>
  )
}

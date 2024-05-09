interface ButtonComponentProps {
  label: string
  onClick?: () => void
  type?: 'submit' | 'button' | 'reset' | undefined
}

export default function ButtonComponent({
  label,
  onClick,
  type,
}: ButtonComponentProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className="bg-plyrColor hover:bg-blue-500 text-white font-bold px-4 rounded-md text-base mr-2 h-12 self-center"
    >
      {label}
    </button>
  )
}

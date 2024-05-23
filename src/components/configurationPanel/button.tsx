interface ButtonComponentProps {
  label: string
  onClick?: () => void
  type?: 'submit' | 'button' | 'reset' | undefined
  style?: string
}

export default function ButtonComponent({
  label,
  onClick,
  type,
  style = 'py-2 text-base',
}: ButtonComponentProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-plyrColor hover:bg-blue-500 text-white font-bold w-24 rounded-md ${style} `}
    >
      {label}
    </button>
  )
}

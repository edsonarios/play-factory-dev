export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-300 rounded-full h-6">
      <div
        className={`h-6 rounded-full text-center text-white
        ${
          value === -1
            ? 'bg-red-200'
            : value === 100
              ? 'bg-green-600'
              : 'bg-plyrColor'
        } `}
        style={{ width: `${value === -1 ? 100 : value}%` }}
      >
        {value === -1 ? '' : value + '%'}
      </div>
    </div>
  )
}

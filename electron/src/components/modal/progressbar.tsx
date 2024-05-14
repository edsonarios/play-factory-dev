export function ProgressBar({ value }: { value: number }) {
  console.log(value)
  return (
    <div className="w-full bg-gray-300 rounded-full h-6">
      <div
        className={`${value === -1 ? 'bg-red-200' : 'bg-plyrColor'} h-6 rounded-full text-center text-white`}
        style={{ width: `${value === -1 ? 100 : value}%` }}
      >
        {value === -1 ? '' : value + '%'}
      </div>
    </div>
  )
}

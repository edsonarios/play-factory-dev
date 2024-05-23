import { EstatusConvertion } from './statusConversion'

export function ProgressBar({ value }: { value: string }) {
  return (
    <div className="w-full bg-gray-300 rounded-full h-6">
      <div
        className={`h-6 rounded-full text-center text-white
        ${
          value === EstatusConvertion.Hidden ||
          value === EstatusConvertion.Cancel ||
          value === 'error'
            ? 'bg-red-200'
            : value === '100'
              ? 'bg-green-600'
              : 'bg-plyrColor'
        } `}
        style={{
          width: `${value === EstatusConvertion.Hidden || value === 'error' ? 100 : value}%`,
        }}
      >
        {value === EstatusConvertion.Hidden ||
        value === EstatusConvertion.Cancel ||
        value === 'error'
          ? ''
          : value + '%'}
      </div>
    </div>
  )
}

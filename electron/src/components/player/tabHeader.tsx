import { Tab } from '@headlessui/react'

export function TabHeader({ children }: { children: React.ReactNode }) {
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          'text-lg w-full rounded-md py-2 font-medium text-gray-700',
          selected
            ? 'bg-white shadow'
            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
        )
      }
    >
      {children}
    </Tab>
  )
}

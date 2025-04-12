import React from 'react'
import { useToast } from './use-toast'
import { X } from 'lucide-react'

export function Toast() {
  const { activeToast, dismiss } = useToast()

  if (!activeToast) return null

  return (
    <div className="toast-container fixed bottom-4 right-4 z-50">
      <div
        className={`max-w-md p-4 rounded-lg shadow-lg flex items-start gap-3 ${
          activeToast.variant === 'destructive'
            ? 'bg-red-50 text-red-900 border border-red-200'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        <div className="flex-1">
          <h3 className="font-medium text-sm">{activeToast.title}</h3>
          {activeToast.description && (
            <p className="text-sm mt-1 text-gray-600">{activeToast.description}</p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="text-gray-500 hover:text-gray-900"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Export a ToastProvider to wrap your app
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toast />
    </>
  )
}

import { useState } from "react"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (props: ToastProps) => {
    setToast(props)

    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  return {
    toast: showToast,
    activeToast: toast,
    dismiss: () => setToast(null)
  }
}

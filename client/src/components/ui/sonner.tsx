import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 
            "group toast rounded-md border border-border bg-background px-4 py-3 shadow-lg text-foreground select-none transition-colors duration-200",
          description: 
            "text-sm text-muted-foreground",
          actionButton: 
            "bg-primary text-primary-foreground px-3 py-1 rounded-md font-semibold hover:bg-primary/90 transition",
          cancelButton: 
            "bg-muted text-muted-foreground px-3 py-1 rounded-md hover:bg-muted/90 transition",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

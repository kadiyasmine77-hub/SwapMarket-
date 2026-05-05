import * as React from "react";
import { cn } from "./utils";

// AlertDialog built without extra Radix dependency
// The key fix: AlertDialogAction calls user's onClick FIRST, then closes

const AlertDialogContext = React.createContext<{
  onOpenChange: (open: boolean) => void;
}>({ onOpenChange: () => {} });

function AlertDialog({
  open = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const handleChange = onOpenChange ?? (() => {});
  return (
    <AlertDialogContext.Provider value={{ onOpenChange: handleChange }}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay — clicking it does NOT close (user must choose) */}
          <div className="fixed inset-0 bg-black/50" />
          {children}
        </div>
      )}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative z-50 grid w-full max-w-lg gap-4 rounded-lg border bg-white p-6 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
  );
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold leading-none", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-neutral-500", className)} {...props} />;
}

function AlertDialogAction({
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={async (e) => {
        // Execute the user's action FIRST, then close
        if (onClick) await onClick(e);
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogCancel({ className, children, ...props }: React.ComponentProps<"button">) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus:outline-none",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children ?? "Annuler"}
    </button>
  );
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

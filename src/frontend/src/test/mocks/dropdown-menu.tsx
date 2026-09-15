import type { ReactNode } from "react";

/**
 * Test mock for the shadcn/Radix DropdownMenu primitives.
 *
 * Radix DropdownMenu opens on pointer events that jsdom does not implement
 * (userEvent clicks hang; fireEvent.click never opens the menu). This mock
 * renders the trigger and the menu items directly so the language switcher can
 * be exercised with user-level events. Menu items keep the "menuitem" role so
 * semantic queries still work.
 */

export function DropdownMenu({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function DropdownMenuTrigger({
  children,
}: { children?: ReactNode } & Record<string, unknown>) {
  return <>{children}</>;
}

export function DropdownMenuContent({
  children,
}: { children?: ReactNode } & Record<string, unknown>) {
  return <div data-testid="mock-dropdown-content">{children}</div>;
}

export function DropdownMenuItem({
  onClick,
  children,
}: {
  onClick?: () => void;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}

export const DropdownMenuPortal = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const DropdownMenuGroup = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const DropdownMenuLabel = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const DropdownMenuSeparator = () => null;
export const DropdownMenuShortcut = ({
  children,
}: { children?: ReactNode }) => <>{children}</>;
export const DropdownMenuSub = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const DropdownMenuSubTrigger = ({
  children,
}: { children?: ReactNode }) => <>{children}</>;
export const DropdownMenuSubContent = ({
  children,
}: { children?: ReactNode }) => <>{children}</>;
export const DropdownMenuCheckboxItem = ({
  children,
}: { children?: ReactNode }) => <>{children}</>;
export const DropdownMenuRadioGroup = ({
  children,
}: { children?: ReactNode }) => <>{children}</>;
export const DropdownMenuRadioItem = ({
  children,
}: { children?: ReactNode }) => <>{children}</>;

import type { ReactNode } from "react";

/**
 * Test mock for the shadcn/Radix Select primitives.
 *
 * Radix Select relies on pointer events (hasPointerCapture) that jsdom does
 * not implement, so opening the dropdown and selecting an option in a test
 * throws and never renders the options. This mock renders a native <select>,
 * which jsdom handles natively and which exposes the same value/onValueChange
 * contract the pages use.
 */

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <select
      data-ocid="mock-select"
      value={value ?? ""}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({
  children,
}: { children?: ReactNode } & Record<string, unknown>) {
  return <>{children}</>;
}

export function SelectValue({
  placeholder,
}: { placeholder?: string } & Record<string, unknown>) {
  return <span>{placeholder}</span>;
}

export function SelectContent({
  children,
}: { children?: ReactNode } & Record<string, unknown>) {
  return <>{children}</>;
}

export function SelectItem({
  value,
  children,
}: { value: string; children?: ReactNode } & Record<string, unknown>) {
  return <option value={value}>{children}</option>;
}

export const SelectGroup = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const SelectLabel = ({ children }: { children?: ReactNode }) => (
  <>{children}</>
);
export const SelectSeparator = () => null;
export const SelectScrollUpButton = () => null;
export const SelectScrollDownButton = () => null;

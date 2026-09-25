"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

import FieldMessage from "./FieldMessage";
import {
  FIELD_LABEL_BASE,
  FIELD_LABEL_COLOR,
  FIELD_LABEL_FIXED,
  FIELD_LABEL_FLOAT,
  fieldClass,
  type FieldSize,
  type FieldTone,
} from "./fieldStyles";

// Inputs whose native UI always shows something, so the label never sits inside.
const ALWAYS_FLOATED_TYPES = new Set([
  "date",
  "time",
  "datetime-local",
  "month",
  "week",
  "color",
]);

interface FieldExtras {
  /** Floating label. Without it the placeholder stays visible (search bars). */
  label?: ReactNode;
  /** Red state; a string/node is also shown as a message under the field. */
  error?: ReactNode;
  /** Neutral text under the field (hidden while an error is shown). */
  helperText?: ReactNode;
  /** Colour of the underline; overridden by `error`. */
  tone?: FieldTone;
  size?: FieldSize;
  /** Icon at the start of the field. */
  startIcon?: ReactNode;
  /** Button / icon at the end of the field (clear, show password, …). */
  endAdornment?: ReactNode;
  /** Keep the label floated even when the field is empty. */
  floatLabel?: boolean;
  containerClassName?: string;
  /** Anything to render under the field (strength meter, validation, …). */
  children?: ReactNode;
}

function useFieldParts({
  id,
  label,
  error,
  helperText,
  tone,
  size = "md",
  startIcon,
  endAdornment,
  placeholder,
  floated,
}: FieldExtras & { id?: string; placeholder?: string; floated: boolean }) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const effectiveTone: FieldTone = error ? "error" : (tone ?? "default");
  const hasMessage = error !== undefined && error !== null && typeof error !== "boolean";
  const messageId = hasMessage || helperText ? `${fieldId}-message` : undefined;

  // With a floating label the placeholder acts as a hint shown only on focus.
  const placeholderClass = label
    ? "placeholder:text-transparent focus:placeholder:text-[#bcb1a9]"
    : "placeholder:text-[#b2a59d]";

  const padding = `${startIcon ? "ps-7" : ""} ${endAdornment ? "pe-10" : ""}`;

  const labelNode = label ? (
    <label
      htmlFor={fieldId}
      className={`${FIELD_LABEL_BASE} ${startIcon ? "start-7" : "start-0"} ${
        floated ? FIELD_LABEL_FIXED[size] : FIELD_LABEL_FLOAT[size]
      } ${FIELD_LABEL_COLOR[effectiveTone]}`}
    >
      {label}
    </label>
  ) : null;

  const message = hasMessage ? (
    <FieldMessage id={messageId}>{error}</FieldMessage>
  ) : helperText ? (
    <FieldMessage id={messageId} tone="info" plain>
      {helperText}
    </FieldMessage>
  ) : null;

  return {
    fieldId,
    effectiveTone,
    messageId,
    labelNode,
    message,
    placeholder: placeholder ?? (label ? " " : undefined),
    className: `${fieldClass({ tone: effectiveTone, size })} ${placeholderClass} ${padding}`,
  };
}

const iconWrap =
  "pointer-events-none absolute start-0 top-1/2 flex -translate-y-1/2 items-center text-[#a59a92] transition-colors peer-focus:text-[#9a8171]";

export type TextFieldProps = Omit<ComponentProps<"input">, "size" | "children"> &
  FieldExtras;

/** Underlined text input with a floating label — the site-wide input style. */
export function TextField({
  label,
  error,
  helperText,
  tone,
  size,
  startIcon,
  endAdornment,
  floatLabel,
  containerClassName = "",
  children,
  className = "",
  id,
  type = "text",
  placeholder,
  ...inputProps
}: TextFieldProps) {
  const parts = useFieldParts({
    id,
    label,
    error,
    helperText,
    tone,
    size,
    startIcon,
    endAdornment,
    placeholder,
    floated: !!floatLabel || ALWAYS_FLOATED_TYPES.has(type),
  });

  return (
    <div
      dir={inputProps.dir}
      className={`relative z-0 w-full text-start ${containerClassName}`}
    >
      <div className="relative">
        <input
          id={parts.fieldId}
          type={type}
          placeholder={parts.placeholder}
          aria-invalid={parts.effectiveTone === "error" || undefined}
          aria-describedby={parts.messageId}
          className={`${parts.className} [unicode-bidi:plaintext] ltr:text-left rtl:text-right [&::-ms-reveal]:hidden ${className}`}
          {...inputProps}
        />
        {parts.labelNode}
        {startIcon && <span className={iconWrap}>{startIcon}</span>}
        {endAdornment && (
          <div className="absolute end-0 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {endAdornment}
          </div>
        )}
      </div>
      {parts.message}
      {children}
    </div>
  );
}

export type TextAreaFieldProps = Omit<ComponentProps<"textarea">, "children"> &
  Omit<FieldExtras, "size">;

/** Multi-line version of {@link TextField}. */
export function TextAreaField({
  label,
  error,
  helperText,
  tone,
  startIcon,
  endAdornment,
  floatLabel,
  containerClassName = "",
  children,
  className = "",
  id,
  placeholder,
  rows = 4,
  ...textareaProps
}: TextAreaFieldProps) {
  const parts = useFieldParts({
    id,
    label,
    error,
    helperText,
    tone,
    startIcon,
    endAdornment,
    placeholder,
    floated: !!floatLabel,
  });

  return (
    <div
      dir={textareaProps.dir}
      className={`relative z-0 w-full text-start ${containerClassName}`}
    >
      <div className="relative">
        <textarea
          id={parts.fieldId}
          rows={rows}
          placeholder={parts.placeholder}
          aria-invalid={parts.effectiveTone === "error" || undefined}
          aria-describedby={parts.messageId}
          className={`${parts.className} resize-none leading-6 ${className}`}
          {...textareaProps}
        />
        {parts.labelNode}
        {endAdornment && (
          <div className="absolute end-0 top-2 flex items-center gap-1">
            {endAdornment}
          </div>
        )}
      </div>
      {parts.message}
      {children}
    </div>
  );
}

export default TextField;

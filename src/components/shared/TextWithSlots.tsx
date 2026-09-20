import { Fragment, type ReactNode } from "react";

// Like TextWithSlot, but for sentences with several tokens, e.g.
// "Use {bold} or {link}". Each {name} is replaced by slots[name].
export default function TextWithSlots({
  text,
  slots,
}: {
  text: string;
  slots: Record<string, ReactNode>;
}) {
  const parts = text.split(/(\{\w+\})/g);

  return (
    <>
      {parts.map((part, index) => {
        const match = /^\{(\w+)\}$/.exec(part);

        if (match && match[1] in slots) {
          return <Fragment key={index}>{slots[match[1]]}</Fragment>;
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

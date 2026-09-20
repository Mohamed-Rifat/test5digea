import type { ReactNode } from "react";

// Renders a translated sentence that contains a token such as {link} or
// {bold}, replacing it with a React node. This keeps the sentence in one
// translation key so each language can place the node where it reads best.
export default function TextWithSlot({
  text,
  token,
  slot,
}: {
  text: string;
  token: string;
  slot: ReactNode;
}) {
  const [before, after = ""] = text.split(token);

  return (
    <>
      {before}
      {slot}
      {after}
    </>
  );
}

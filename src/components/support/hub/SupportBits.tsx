"use client";

import Link from "next/link";

// Internal routes use client-side navigation; mailto:/tel:/#hash use <a>.
export function SmartLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

// Renders a translated sentence containing a {bold} placeholder, so the
// highlighted word can sit anywhere in the sentence in either language.
export function Rich({ text, bold }: { text: string; bold: string }) {
  const [before, after = ""] = text.split("{bold}");

  return (
    <>
      {before}
      <strong className="text-[#30251f]">{bold}</strong>
      {after}
    </>
  );
}

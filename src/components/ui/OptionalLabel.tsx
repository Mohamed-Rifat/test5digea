/** Field label followed by a muted "(optional)" hint. */
export default function OptionalLabel({ text, optional }: { text: string; optional: string }) {
  return (
    <>
      {text} <span className="text-[#b3a89f]">{optional}</span>
    </>
  );
}

/** Field label followed by a red asterisk. */
export default function RequiredLabel({ text }: { text: string }) {
  return (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );
}

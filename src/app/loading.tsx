import Loader5Digea from "@/components/shared/Loader5Digea";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-[#faf8f6]/90 backdrop-blur-md">
      <Loader5Digea />
    </div>
  );
}

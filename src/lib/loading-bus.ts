type LoadingState = { loading: boolean; label?: string };
type Listener = (state: LoadingState) => void;

let activeCount = 0;
let currentLabel: string | undefined;
const listeners = new Set<Listener>();

function emit() {
  const state: LoadingState = { loading: activeCount > 0, label: currentLabel };
  listeners.forEach((listener) => listener(state));
}

export const loadingBus = {
  show(label?: string) {
    activeCount += 1;
    if (label) currentLabel = label;
    emit();
  },
  hide() {
    activeCount = Math.max(0, activeCount - 1);
    if (activeCount === 0) currentLabel = undefined;
    emit();
  },
  reset() {
    activeCount = 0;
    currentLabel = undefined;
    emit();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener({ loading: activeCount > 0, label: currentLabel });
    return () => listeners.delete(listener);
  },
};

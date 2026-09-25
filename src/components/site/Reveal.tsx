import { useEffect, useRef, useState, type ReactNode } from "react";

// Content is visible in the prerendered HTML; only sections still below the
// viewport after hydration get hidden and animated in on scroll.
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const style =
    state === "static"
      ? undefined
      : {
          opacity: state === "shown" ? 1 : 0,
          transform: state === "shown" ? "none" : `translateY(${y}px)`,
          transition: `opacity 0.35s ${ease} ${delay}s, transform 0.35s ${ease} ${delay}s`,
        };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

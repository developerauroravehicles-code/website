"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useId, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "span";
};

export function RipplePress({ children, className, as = "div" }: Props) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: string }[]>([]);
  const uid = useId();
  const Component = as;

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = `${uid}-${Date.now()}`;
    setRipples((prev) => [...prev, { x, y, id }]);
  }, [uid]);

  const remove = useCallback((id: string) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <Component
      className={`relative overflow-hidden ${className ?? ""}`}
      onPointerDown={onPointerDown}
    >
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute size-8 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,69,0,0.22)_40%,transparent_72%)]"
            style={{ left: r.x, top: r.y }}
            initial={{ x: "-50%", y: "-50%", scale: 0.2, opacity: 0.85 }}
            animate={{ x: "-50%", y: "-50%", scale: 18, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => remove(r.id)}
          />
        ))}
      </AnimatePresence>
    </Component>
  );
}

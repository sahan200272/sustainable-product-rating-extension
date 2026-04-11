import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate, motion } from "framer-motion";

/**
 * AnimatedCounter
 * Counts up from 0 to `to` when it enters the viewport.
 *
 * Props:
 *  to       {number}  – target value
 *  duration {number}  – animation duration in seconds (default 1.6)
 *  suffix   {string}  – text appended after the number (e.g. "+", "%")
 *  prefix   {string}  – text prepended before the number (e.g. "+")
 *  className{string}  – extra Tailwind classes
 */
export default function AnimatedCounter({
  to = 0,
  duration = 1.6,
  suffix = "",
  prefix = "",
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  // Display value as formatted string
  const [display, setDisplay] = React.useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, to, {
      duration,
      ease: "easeOut",
    });
    const unsubscribe = rounded.on("change", (v) => {
      setDisplay(v.toLocaleString());
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, to, duration, motionValue, rounded]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "fade-in-up" | "scale-in" | "none";
  delay?: number;
  duration?: "short" | "medium" | "long" | "extra-long";
}

export function Motion({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = "long",
  className,
  ...props
}: MotionProps) {
  const animationClass = animation !== "none" ? `animate-${animation}` : "";
  const delayClass = delay > 0 ? `animate-delay-${delay}` : "";

  // Mapping duration to utility or style
  const durationStyle = {
    "--animation-duration": `var(--duration-${duration})`,
  } as React.CSSProperties;

  return (
    <div
      className={cn(animationClass, delayClass, className)}
      style={{ ...durationStyle, ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Stagger provides a container that automatically staggers children.
 */
interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialDelay?: number;
}

export function Stagger({
  children,
  className,
  initialDelay = 0,
  ...props
}: StaggerProps) {
  const delaySteps = [0, 100, 200, 300, 400, 500] as const;

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<{ className?: string }>(child)) {
          const delayIndex = Math.min(
            Math.floor(initialDelay / 100) + index,
            delaySteps.length - 1,
          );

          return React.cloneElement(child, {
            className: cn(
              "animate-fade-in-up",
              child.props.className,
              `animate-delay-${delaySteps[delayIndex]}`,
            ),
          });
        }
        return child;
      })}
    </div>
  );
}

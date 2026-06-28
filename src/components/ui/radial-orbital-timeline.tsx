'use client';

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Link, Zap, Search, Layers, PenTool, Code, ShieldCheck, Rocket } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IonityLogo } from "@/components/ui/IonityLogo/IonityLogo";
import { useUiSound } from "@/hooks/useUiSound";

gsap.registerPlugin(ScrollTrigger);

interface RadialOrbitalTimelineProps {
  timelineProgress?: React.MutableRefObject<number>;
}

export default function RadialOrbitalTimeline({ timelineProgress }: RadialOrbitalTimelineProps) {
  const t = useTranslations("howItWorks");
  const playSound = useUiSound();

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({ 1: true });
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeNodeId, setActiveNodeId] = useState<number>(1);
  const [timelineOpacity, setTimelineOpacity] = useState<number>(1.0);
  const [orbitRadius, setOrbitRadius] = useState<number>(200);
  const activeNodeIdRef = useRef<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Set initial rotation angle based on text direction (RTL = 180 deg, LTR = 0 deg)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRtl = document.documentElement.dir === 'rtl';
      setRotationAngle(isRtl ? 180 : 0);
    }
  }, []);

  // Responsive radius adjustments based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1200) {
        setOrbitRadius(200);
      } else if (window.innerWidth >= 1024) {
        setOrbitRadius(170);
      } else {
        setOrbitRadius(135);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recalculate ScrollTrigger start/end positions after layout shifts and font loads
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load methodology steps dynamically from translation files
  const stepDetails = t.raw("step_details") as { title: string; desc: string }[];
  const icons = [Search, Layers, PenTool, Code, ShieldCheck, Rocket];
  
  const timelineData = stepDetails.map((step, idx) => ({
    id: idx + 1,
    title: step.title,
    content: step.desc,
    date: `0${idx + 1}`,
    category: t("overline"),
    icon: icons[idx] || Code,
    relatedIds: idx > 0 ? [idx] : [],
    status: idx < 2 ? ("completed" as const) : idx === 2 ? ("in-progress" as const) : ("pending" as const),
    energy: 100 - idx * 15,
  }));

  const handleContainerClick = () => {
    // Keep at least the active step expanded
    setExpandedItems({ [activeNodeId]: true });
  };

  const toggleItem = (id: number) => {
    playSound();
    activeNodeIdRef.current = id;
    setActiveNodeId(id);
    setExpandedItems({ [id]: true });
  };

  // GSAP ScrollTrigger pinning and scroll progress scrub
  useGSAP(() => {
    if (!containerRef.current || !timelineRef.current) return;

    // Pin the section when it enters viewport
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=2400", // Scroll length for the methodology steps scrub
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // Propagate local progress to WebGL Canvas
        if (timelineProgress) {
          timelineProgress.current = progress;
        }

        // 1. Opacity control for HTML elements (Entry & Exit phases)
        let opacity = 1.0;
        if (progress < 0.20) {
          // Fade in smoothly between 0.05 and 0.20
          if (progress < 0.05) {
            opacity = 0;
          } else {
            opacity = (progress - 0.05) / 0.15;
          }
        } else if (progress > 0.80) {
          // Fade out smoothly between 0.80 and 0.95
          if (progress > 0.95) {
            opacity = 0;
          } else {
            opacity = 1.0 - (progress - 0.80) / 0.15;
          }
        }
        setTimelineOpacity(opacity);

        // 2. Active step and rotation scrubbing (between 0.20 and 0.80)
        const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
        const targetActiveAngle = isRtl ? 180 : 0;

        if (progress >= 0.20 && progress <= 0.80) {
          const scrubProgress = (progress - 0.20) / 0.60;
          
          // Rotate orbit fully (360 degrees) starting from targetActiveAngle
          const angle = targetActiveAngle - scrubProgress * 360;
          setRotationAngle(angle);

          const activeIdx = Math.min(Math.floor(scrubProgress * 6), 5);
          const activeId = activeIdx + 1;

          if (activeNodeIdRef.current !== activeId) {
            activeNodeIdRef.current = activeId;
            setActiveNodeId(activeId);
            setExpandedItems({ [activeId]: true });
          }
        } else if (progress < 0.20) {
          // Lock at step 1 before scrubbing
          setRotationAngle(targetActiveAngle);
          if (activeNodeIdRef.current !== 1) {
            activeNodeIdRef.current = 1;
            setActiveNodeId(1);
            setExpandedItems({ 1: true });
          }
        } else {
          // Lock at step 6 after scrubbing
          setRotationAngle(targetActiveAngle - 360);
          if (activeNodeIdRef.current !== 6) {
            activeNodeIdRef.current = 6;
            setActiveNodeId(6);
            setExpandedItems({ 6: true });
          }
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, { scope: containerRef, dependencies: [] });

  // Calculate Node Position on Desktop Orbit
  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = orbitRadius; // Responsive radius
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const isActive = activeNodeId === index + 1;

    // Active node has full opacity and top z-index, others scale by depth perspective
    const zIndex = isActive ? 200 : Math.round(100 + 50 * Math.cos(radian));
    const opacity = isActive ? 1.0 : Math.max(0.3, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  };

  const getStatusStyles = (status: "completed" | "in-progress" | "pending"): string => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-500/30";
      case "in-progress":
        return "text-sky-400 bg-sky-950/40 border-sky-500/30";
      case "pending":
        return "text-zinc-400 bg-zinc-950/40 border-zinc-500/30";
    }
  };

  const orbitDiameter = orbitRadius * 2;
  const containerSize = orbitDiameter + 150;

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden py-24 select-none"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div 
        className="w-full flex flex-col items-center justify-center"
        style={{ opacity: timelineOpacity, transition: 'opacity 0.2s ease-out' }}
      >

      {/* ── Desktop Orbital Side-by-Side Layout ── */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl px-6 gap-12" ref={timelineRef}>
        
        {/* Left: The Orbit Circle with 3D logo glowing behind */}
        <div 
          className="relative flex items-center justify-center shrink-0"
          style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
        >
          
          {/* Glowing Orbit Path shaped like the Ionity Logo (Split Circle + Vertical Line) */}
          <div 
            className="absolute flex items-center justify-center pointer-events-none opacity-40"
            style={{ width: `${orbitDiameter}px`, height: `${orbitDiameter}px` }}
          >
            <svg viewBox="0 0 100 100" className="absolute w-full h-full">
              <defs>
                <mask id="orbit-split-mask-large">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="47" y="0" width="6" height="100" fill="black" />
                </mask>
                <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-100)" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent-100)" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Split Outer Circle (O) */}
              <circle
                cx="50"
                cy="50"
                r="46"
                stroke="url(#orbit-gradient)"
                strokeWidth="0.75"
                strokeDasharray="2 3"
                fill="none"
                mask="url(#orbit-split-mask-large)"
              />
              {/* Vertical Center Line (I) */}
              <line
                x1="50"
                y1="2"
                x2="50"
                y2="98"
                stroke="url(#orbit-gradient)"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            </svg>
          </div>

          {/* Center Transparent Ring to reveal the 3D WebGL Particle Logo */}
          <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20 flex items-center justify-center z-10">
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10 animate-ping opacity-30"></div>
            <div className="absolute w-28 h-28 rounded-full border border-emerald-500/5 animate-pulse"></div>
          </div>

          {/* Orbit Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isActive = activeNodeId === item.id;
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: position.zIndex,
              opacity: position.opacity,
              transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
            };

            return (
              <div
                key={item.id}
                className="absolute cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Outer Energy Pulse Ring */}
                <div
                  className={`absolute rounded-full -inset-2 transition-all duration-700 ${
                    isActive ? "animate-pulse" : "opacity-0"
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)`,
                  }}
                ></div>

                {/* Node Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isActive ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-125" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"}
                    transition-all duration-300
                  `}
                >
                  <Icon size={18} />
                </div>

                {/* Step Title Label */}
                <div
                  className={`
                    absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[10px] font-bold tracking-widest uppercase
                    transition-all duration-300
                    ${isActive ? "text-emerald-400 scale-110" : "text-zinc-500"}
                  `}
                >
                  {item.title.split(". ")[1] || item.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Stationary Details Card */}
        <div className="flex-grow max-w-md">
          {(() => {
            const activeItem = timelineData.find(item => item.id === activeNodeId) || timelineData[0];
            return (
              <Card key={activeNodeId} className="animate-fadeIn w-full bg-[#141419]/90 backdrop-blur-md border border-[#24242e]/80 shadow-2xl shadow-black/80 p-8 text-start select-none">
                <div className="flex justify-between items-center mb-6">
                  <Badge className={`card-badge px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-none ${getStatusStyles(activeItem.status)}`}>
                    {activeItem.status === "completed" 
                      ? t("status_completed") 
                      : activeItem.status === "in-progress" 
                        ? t("status_in_progress") 
                        : t("status_pending")}
                  </Badge>
                  <span className="card-step text-xs font-mono text-zinc-500">
                    STEP {activeItem.date}
                  </span>
                </div>
                <h3 className="card-title text-2xl font-bold text-white mb-4 leading-tight">
                  {activeItem.title}
                </h3>
                <p className="card-desc text-sm text-zinc-400 leading-relaxed mb-8">
                  {activeItem.content}
                </p>

                <div className="card-stats pt-6 border-t border-zinc-900">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Zap size={10} className="text-emerald-400" />
                      Progress Energy
                    </span>
                    <span className="font-mono text-emerald-400">{activeItem.energy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${activeItem.energy}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      </div>

      {/* ── Mobile Sleek Vertical Timeline Fallback ── */}
      <div className="flex md:hidden flex-col w-full max-w-md px-6 gap-8 relative mt-8">
        {/* Timeline track line */}
        <div className="absolute left-[29px] top-4 bottom-4 w-px bg-zinc-800"></div>

        {timelineData.map((item) => {
          const isActive = activeNodeId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`flex gap-6 relative transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}
              onClick={() => toggleItem(item.id)}
            >
              {/* Vertical Step Node */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0
                  ${isActive ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-110" : "bg-zinc-900 text-zinc-500 border border-zinc-800"}
                  transition-all duration-300
                `}
              >
                <Icon size={18} />
              </div>

              {/* Vertical Step Card */}
              <div className="flex-grow flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                    STEP {item.date}
                  </span>
                  <Badge className={`px-2 py-0 text-[9px] uppercase font-bold tracking-wider rounded-none ${getStatusStyles(item.status)}`}>
                    {item.status === "completed" 
                      ? t("status_completed") 
                      : item.status === "in-progress" 
                        ? t("status_in_progress") 
                        : t("status_pending")}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {item.title}
                </h3>
                {isActive && (
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1 animate-fadeIn">
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

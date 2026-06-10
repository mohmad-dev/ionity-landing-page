'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './ProductShowcase.module.css';

gsap.registerPlugin(ScrollTrigger);

export const ProductShowcase = () => {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // We use the howItWorks steps for the pinned text items
  const steps = t.raw('howItWorks.steps') as string[];
  
  // Custom step details
  const stepDetails = t.raw('howItWorks.step_details') as { title: string; desc: string }[];

  const handleTabClick = (targetIdx: number) => {
    if (typeof window === 'undefined') return;

    if (window.innerWidth < 1024) {
      const targetEl = imageRefs.current[targetIdx];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (prefersReducedMotion || !sectionRef.current) return;
    
    const allTriggers = ScrollTrigger.getAll();
    const trigger = allTriggers.find(t => t.trigger === sectionRef.current);
    if (!trigger) return;
    
    const start = trigger.start;
    const end = trigger.end;
    const range = end - start;
    
    let targetScroll = start;
    if (targetIdx === 1) targetScroll = start + range * 0.45;
    if (targetIdx === 2) targetScroll = start + range * 0.9;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  useGSAP(() => {
    if (prefersReducedMotion || !sectionRef.current || !containerRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop: Pin container and animate slides
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%", // 2 viewport heights of scroll
        pin: containerRef.current,
        scrub: true,
        animation: gsap.timeline()
          // Step 1 -> 2
          .to(textRefs.current[0], { opacity: 0, y: -15, duration: 0.4 })
          .to(imageRefs.current[0], { opacity: 0, scale: 0.97, duration: 0.8 }, "<")
          .fromTo(textRefs.current[1], { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 })
          .fromTo(imageRefs.current[1], { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.8 }, "<")
          // Pause
          .to({}, { duration: 0.5 })
          // Step 2 -> 3
          .to(textRefs.current[1], { opacity: 0, y: -15, duration: 0.4 })
          .to(imageRefs.current[1], { opacity: 0, scale: 0.97, duration: 0.8 }, "<")
          .fromTo(textRefs.current[2], { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 })
          .fromTo(imageRefs.current[2], { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.8 }, "<")
      });
    });

    // Mobile fallback: Reset items so they stack and remain visible
    mm.add("(max-width: 1023px)", () => {
      gsap.set(textRefs.current, { opacity: 1, y: 0, scale: 1 });
      gsap.set(imageRefs.current, { opacity: 1, y: 0, scale: 1 });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [prefersReducedMotion] });

  return (
    <section ref={sectionRef} id="product" className={styles.section}>
      <div ref={containerRef} className={styles.pinnedContainer}>
        <div className={styles.layout}>
          
          {/* Left Text Side */}
          <div className={styles.textContent}>
            <div className={styles.textWrapper}>
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  ref={el => { textRefs.current[idx] = el; }}
                  className={styles.stepText}
                  style={{ opacity: idx === 0 ? 1 : 0 }}
                >
                  <div className="caption text-accent mb-4">0{idx + 1} — {step}</div>
                  <h2 className="h2 mb-4">{stepDetails[idx].title}</h2>
                  <p className="body text-secondary max-w-md">{stepDetails[idx].desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Side (Ionity Dev Console) */}
          <div className={styles.visualContent}>
            <div className={styles.mockupWrapper}>
              {[0, 1, 2].map((idx) => (
                <div 
                  key={idx}
                  ref={el => { imageRefs.current[idx] = el; }}
                  className={styles.mockupLayer}
                  style={{ opacity: idx === 0 ? 1 : 0 }}
                >
                  <div className={styles.mockup}>
                    <div className={styles.chrome}>
                      <div className={styles.dots}>
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                      </div>
                      <div className={styles.urlBar}>
                        console.ionity.dev/{idx === 0 ? 'architecture' : idx === 1 ? 'pipelines' : 'edge-traffic'}
                      </div>
                    </div>
                    
                    <div className={styles.app}>
                      {/* Sidebar */}
                      <div className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>
                          <div className={styles.logo}>Ionity</div>
                        </div>
                        <nav className={styles.nav}>
                          <div 
                            className={idx === 0 ? styles.navItemActive : styles.navItem} 
                            onClick={() => handleTabClick(0)}
                          >
                            Topology
                          </div>
                          <div 
                            className={idx === 1 ? styles.navItemActive : styles.navItem} 
                            onClick={() => handleTabClick(1)}
                          >
                            Pipelines
                          </div>
                          <div 
                            className={idx === 2 ? styles.navItemActive : styles.navItem} 
                            onClick={() => handleTabClick(2)}
                          >
                            Edge Network
                          </div>
                          <div className={styles.navItem}>Settings</div>
                        </nav>
                      </div>
                      
                      {/* Main Content Area */}
                      <div className={styles.main}>
                        <header className={styles.topbar}>
                          <div className={styles.pageTitle}>
                            {idx === 0 ? 'System Topology' : idx === 1 ? 'Edge Deploy Pipeline' : 'Global Edge Traffic'}
                          </div>
                          <div className={styles.userProfile}>
                            <div className={styles.avatar}></div>
                            <span className={styles.userName}>Console Admin</span>
                          </div>
                        </header>
                        
                        <div className={styles.content}>
                          {/* VIEW 0: Topology */}
                          {idx === 0 && (
                            <div className={styles.topologyGrid}>
                              <div className={`${styles.topologyNode} ${styles.nodeActive}`}>
                                <span className={styles.nodeTitle}>Edge Gateway</span>
                                <span className={styles.nodeDesc}>Global routing entrypoint.</span>
                                <div className={styles.nodeStatus}>
                                  <span className={styles.nodeStatusDot} /> Active (14ms avg)
                                </div>
                              </div>
                              <div className={`${styles.topologyNode} ${styles.nodeActive}`}>
                                <span className={styles.nodeTitle}>API Service</span>
                                <span className={styles.nodeDesc}>Auto-scaling TypeScript runtime.</span>
                                <div className={styles.nodeStatus}>
                                  <span className={styles.nodeStatusDot} /> 24 active nodes
                                </div>
                              </div>
                              <div className={`${styles.topologyNode} ${styles.nodeActive}`}>
                                <span className={styles.nodeTitle}>DB Sync Service</span>
                                <span className={styles.nodeDesc}>Sub-ms data synchronization.</span>
                                <div className={styles.nodeStatus}>
                                  <span className={styles.nodeStatusDot} /> Primary + 3 Replicas
                                </div>
                              </div>
                              <div className={styles.topologyNode}>
                                <span className={styles.nodeTitle}>Analytic Pipelines</span>
                                <span className={styles.nodeDesc}>Cold storage & clickstreams.</span>
                                <div className={styles.nodeStatus}>
                                  <span className={styles.nodeStatusDot} style={{ background: '#7c7c7c', boxShadow: 'none' }} /> Standby
                                </div>
                              </div>
                            </div>
                          )}

                          {/* VIEW 1: CI/CD Pipeline */}
                          {idx === 1 && (
                            <div className={styles.pipelineContainer}>
                              <div className={styles.stagesList}>
                                <div className={styles.stageItem}>
                                  <span className={styles.stageLabel}>Lint & Typecheck</span>
                                  <span className={styles.stageStatus}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Passed
                                  </span>
                                </div>
                                <div className={styles.stageItem}>
                                  <span className={styles.stageLabel}>Build Optimizations</span>
                                  <span className={styles.stageStatus}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Success
                                  </span>
                                </div>
                              </div>
                              <div className={styles.terminal}>
                                <div className={styles.terminalLogs}>
                                  <span className={styles.terminalHighlight}>$ next build</span><br />
                                  ▲ Next.js 16.2.9 (Turbopack)<br />
                                  ✓ Compiled successfully in 1.4s<br />
                                  ✓ Edge routers updated globally [42 regions]<br />
                                  <span className={styles.terminalHighlight}>✓ Deploy status: SUCCESSFUL</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* VIEW 2: Edge Traffic */}
                          {idx === 2 && (
                            <>
                              <div className={styles.metricsRow}>
                                <div className={styles.metricCard}>
                                  <span className={styles.metricLabel}>Total requests</span>
                                  <span className={styles.metricValue}>8.4M</span>
                                  <span className={styles.metricTrend}>+14% this hr</span>
                                </div>
                                <div className={styles.metricCard}>
                                  <span className={styles.metricLabel}>Avg Latency</span>
                                  <span className={styles.metricValue}>12ms</span>
                                  <span className={styles.metricTrend}>Optimal SLA</span>
                                </div>
                                <div className={styles.metricCard}>
                                  <span className={styles.metricLabel}>Bandwidth</span>
                                  <span className={styles.metricValue}>42.5 TB</span>
                                  <span className={styles.metricTrend}>Edge cache: 96%</span>
                                </div>
                              </div>
                              
                              <div className={styles.chartArea}>
                                <div className={styles.chartHeader}>
                                  <span className={styles.chartTitle}>Region Routing Load</span>
                                  <div className={styles.chartLegend}>
                                    <span className={styles.legendDot}></span> Active
                                    <span className={styles.legendDot} style={{ background: '#7c7c7c' }}></span> Standby
                                  </div>
                                </div>
                                <div className={styles.bars}>
                                  {[75, 90, 45, 82, 60, 95, 70].map((h, i) => (
                                    <div key={i} className={styles.barGroup}>
                                      <div className={styles.bar} style={{ height: `${h}%`, opacity: 0.9 }}></div>
                                      <div className={styles.barSecondary} style={{ height: `${h * 0.2}%`, opacity: 0.4 }}></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

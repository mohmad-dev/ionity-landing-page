import React, { useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button/Button';
import { MagneticButton } from '@/components/ui/MagneticButton/MagneticButton';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';
import { useUiSound } from '@/hooks/useUiSound';
import styles from './ImmersiveScene.module.css';

/* ── Service icons ──────────────────────────────────────────── */
const ICONS = [
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="12" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key={6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  <svg key={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  <svg key={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
  <svg key={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M12 3v18"/></svg>,
];

interface ScrollContentProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  timelineProgress: React.MutableRefObject<number>;
}

/* ── 3D Tilt physics on service cards ──────────────────────── */
const useTilt = () => {
  const cardRef = useRef<HTMLElement>(null);
  const raf = useRef<number>(0);
  const current = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const target  = useRef({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width;
    const yRel = (e.clientY - rect.top)  / rect.height;
    target.current.rx = (yRel - 0.5) * -14;   // pitch
    target.current.ry = (xRel - 0.5) *  14;   // yaw
    target.current.gx = xRel * 100;
    target.current.gy = yRel * 100;

    // Also update spotlight CSS vars
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  const animate = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    // Exponential lerp for spring-like feel
    c.rx += (t.rx - c.rx) * 0.12;
    c.ry += (t.ry - c.ry) * 0.12;
    c.gx += (t.gx - c.gx) * 0.12;
    c.gy += (t.gy - c.gy) * 0.12;
    el.style.transform = `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(4px)`;
    el.style.setProperty('--gx', `${c.gx}%`);
    el.style.setProperty('--gy', `${c.gy}%`);
    raf.current = requestAnimationFrame(animate);
  }, []);

  const onMouseEnter = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);
  }, [animate]);

  const onMouseLeave = useCallback(() => {
    target.current = { rx: 0, ry: 0, gx: 50, gy: 50 };
    // Let spring settle
    const settle = () => {
      const el = cardRef.current;
      if (!el) return;
      const c = current.current;
      const t = target.current;
      c.rx += (t.rx - c.rx) * 0.08;
      c.ry += (t.ry - c.ry) * 0.08;
      if (Math.abs(c.rx) > 0.05 || Math.abs(c.ry) > 0.05) {
        el.style.transform = `perspective(900px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
        raf.current = requestAnimationFrame(settle);
      } else {
        el.style.transform = '';
        cancelAnimationFrame(raf.current);
      }
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(settle);
  }, []);

  return { cardRef, onMouseMove, onMouseEnter, onMouseLeave };
};

/* ── Individual tiltable card ───────────────────────────────── */
const ServiceCard = ({ service, index, renderMicroUI }: {
  service: { title: string; description: string; icon: React.ReactNode };
  index: number;
  renderMicroUI: (i: number) => React.ReactNode;
}) => {
  const { cardRef, onMouseMove, onMouseEnter, onMouseLeave } = useTilt();

  return (
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className={styles.serviceCard}
      onMouseMove={onMouseMove as any}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={styles.cardNumber}>0{index + 1}</span>
      <div className={styles.serviceIcon}>{service.icon}</div>
      <h3 className={styles.serviceTitle}>{service.title}</h3>
      <p className={styles.serviceDesc}>{service.description}</p>
      {renderMicroUI(index)}
    </article>
  );
};

export const ScrollContent = ({ scrollContainerRef, timelineProgress }: ScrollContentProps) => {
  const t = useTranslations();
  const playSound = useUiSound();

  const services = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({
    title: t(`features.items.${i}.title`),
    description: t(`features.items.${i}.description`),
    icon: ICONS[i],
  }));

  const renderMicroUI = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className={styles.microUI} aria-hidden="true">
            <div className={styles.pipeline}>
              <span className={`${styles.pipeDot} ${styles.active}`} />
              <div className={styles.pipeLine} />
              <span className={`${styles.pipeDot} ${styles.active}`} />
              <div className={styles.pipeLine} />
              <span className={`${styles.pipeDot} ${styles.pulse}`} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.microUI} aria-hidden="true">
            <div className={styles.radialRing}>
              <div className={styles.radialDot} />
              <span className="text-[9px] font-mono opacity-40">SYNCING</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.microUI} aria-hidden="true">
            <div className={styles.serverRack}>
              <div className={styles.serverRow}>
                <span className={styles.ledGreen} />
                <span className="font-mono text-[9px] opacity-40">NODE-A</span>
                <span className="font-mono text-[9px] text-emerald-400">OK</span>
              </div>
              <div className={styles.serverRow}>
                <span className={styles.ledGreen} />
                <span className="font-mono text-[9px] opacity-40">NODE-B</span>
                <span className="font-mono text-[9px] text-emerald-400">OK</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.microUI} aria-hidden="true">
            <div className={styles.terminal}>
              <span className="text-emerald-400 font-mono text-[10px]">$</span>
              <span className="font-mono text-[9px] ml-1 text-zinc-300">deploy --success</span>
              <span className={styles.cursor} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.microUI} aria-hidden="true">
            <div className={styles.blueprint}>
              <div className={styles.blueprintGrid} />
              <div className={styles.crosshair} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className={styles.microUI} aria-hidden="true">
            <div className={styles.scanner}>
              <div className={styles.scannerLine} />
              <span className="font-mono text-[9px] text-emerald-400 tracking-wider">PROTECTED</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.scrollContent} ref={scrollContainerRef}>

      {/* ════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionHero}`} id="hero">
        <div className={styles.heroContent}>
          {/* Overline — letter-spacing animates in entry */}
          <div className={styles.overline} data-entry-overline>
            <span className={styles.dot} />
            <span className={styles.overlineText}>{t('hero.overline')}</span>
          </div>

          {/* Headline — skew + slide up */}
          <h1 className={styles.heroHeadline} data-entry-headline>
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className={styles.heroSubtitle} data-entry-sub>
            {t('hero.subtitle')}
          </p>

          {/* CTA actions */}
          <div className={styles.heroActions} data-entry-actions>
            <MagneticButton>
              <Button
                href="https://wa.me/1234567890"
                variant="primary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playSound}
              >
                {t('hero.cta_primary')}
              </Button>
            </MagneticButton>
            <MagneticButton strength={10}>
              <Button href="#services" variant="secondary" size="lg" onClick={playSound}>
                {t('hero.cta_secondary')}
              </Button>
            </MagneticButton>
          </div>

          {/* Metrics */}
          <div className={styles.metricsStrip} data-entry-metrics>
            <div className={styles.metric}>
              <span className={styles.metricVal}>{t('hero.metric1_val')}</span>
              <span className={styles.metricLbl}>{t('hero.metric1_lbl')}</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metric}>
              <span className={styles.metricVal}>{t('hero.metric2_val')}</span>
              <span className={styles.metricLbl}>{t('hero.metric2_lbl')}</span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metric}>
              <span className={styles.metricVal}>{t('hero.metric3_val')}</span>
              <span className={styles.metricLbl}>{t('hero.metric3_lbl')}</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint} data-entry-scroll aria-hidden="true">
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2 — SERVICES
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionServices} py-32`} id="services">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <p className={styles.sectionOverline}>{t('features.overline')}</p>
            <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
            <p className={styles.sectionSubtitle}>{t('features.subtitle')}</p>
          </div>

          <div className={styles.servicesGrid} data-reveal="stagger">
            {services.map((s, i) => (
              <ServiceCard key={i} service={s} index={i} renderMicroUI={renderMicroUI} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3 — PROCESS
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionProcess} py-32`} id="process">
        <div className="w-full">
          <RadialOrbitalTimeline timelineProgress={timelineProgress} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4 — METRICS
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionMetrics} py-32`} id="metrics">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <p className={styles.sectionOverline}>{t('metrics.overline')}</p>
            <h2 className={styles.sectionTitle}>{t('metrics.title')}</h2>
          </div>
          <div className={styles.bigMetrics} data-reveal="stagger">
            <div className={styles.bigMetric}>
              <span className={styles.bigMetricVal}>{t('metrics.stat1_value')}</span>
              <span className={styles.bigMetricLbl}>{t('metrics.stat1_label')}</span>
            </div>
            <div className={styles.bigMetric}>
              <span className={styles.bigMetricVal}>{t('metrics.stat2_value')}</span>
              <span className={styles.bigMetricLbl}>{t('metrics.stat2_label')}</span>
            </div>
            <div className={styles.bigMetric}>
              <span className={styles.bigMetricVal}>{t('metrics.stat3_value')}</span>
              <span className={styles.bigMetricLbl}>{t('metrics.stat3_label')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5 — CTA
      ════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionCTA} py-32`} id="cta">
        <div className={styles.ctaInner} data-reveal>
          <p className={styles.sectionOverline}>{t('hero.overline')}</p>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaSubtitle}>{t('cta.subtitle')}</p>
          <div className={styles.ctaActions}>
            <MagneticButton>
              <Button href="#contact" variant="primary" size="lg" onClick={playSound}>
                {t('cta.primary')}
              </Button>
            </MagneticButton>
          </div>
        </div>
      </section>

    </div>
  );
};

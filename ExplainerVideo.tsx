import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

const PALETTE = {
  bg: '#F3F7FC',
  white: '#FFFFFF',
  navy: '#0F2B46',
  teal: '#0D9488',
  tealLight: '#CCFBF1',
  amber: '#D97706',
  amberLight: '#FEF3C7',
  coral: '#E11D48',
  coralLight: '#FFE4E6',
  blue: '#2563EB',
  blueLight: '#DBEAFE',
  slate: '#475569',
  border: '#CBD5E1',
  captionBg: 'rgba(255, 255, 255, 0.94)',
};

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Shared Slide Frame with Top Title, Subtle Medical Watermarks, Caption Bar, and Progress Bar
const SlideShell: React.FC<{
  title: string;
  subtitleBadge?: { text: string; bg: string; color?: string };
  caption: string;
  totalFrames?: number;
  children: React.ReactNode;
}> = ({ title, subtitleBadge, caption, totalFrames = 3600, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bg,
        fontFamily: SANS,
        opacity: fadeIn,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 80px 36px 80px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Decorative Circles & Crosses */}
      <svg
        width="1920"
        height="1080"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.35 }}
      >
        <circle cx="80" cy="80" r="190" fill="none" stroke="#BFDBFE" strokeWidth="24" />
        <circle cx="1850" cy="960" r="240" fill="none" stroke="#BFDBFE" strokeWidth="28" />
        <path d="M 1760 150 h 30 M 1775 135 v 30" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
        <path d="M 140 840 h 30 M 155 825 v 30" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
      </svg>

      {/* Header */}
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: 64,
            fontWeight: 700,
            color: PALETTE.navy,
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {subtitleBadge && (
          <div style={{ marginTop: 14 }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: subtitleBadge.bg,
                color: subtitleBadge.color || PALETTE.white,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1.8,
                textTransform: 'uppercase',
                padding: '8px 28px',
                borderRadius: 999,
              }}
            >
              {subtitleBadge.text}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          zIndex: 2,
          margin: '16px 0',
        }}
      >
        {children}
      </div>

      {/* Bottom Narration Caption Pill (Single Clean Line, Zero Overlap) */}
      <div style={{ display: 'flex', justifyContent: 'center', zIndex: 2 }}>
        <div
          style={{
            backgroundColor: PALETTE.captionBg,
            border: `2px solid ${PALETTE.border}`,
            borderRadius: 18,
            padding: '14px 36px',
            maxWidth: 1440,
            boxShadow: '0 6px 20px rgba(15, 43, 70, 0.06)',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontSize: 29,
              color: PALETTE.navy,
              lineHeight: 1.35,
            }}
          >
            {caption}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Reusable Person Silhouette Icon
const PersonIcon: React.FC<{ color: string; showQuestion?: boolean }> = ({
  color,
  showQuestion = false,
}) => (
  <div style={{ position: 'relative', width: 42, height: 74, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {showQuestion && (
      <div
        style={{
          position: 'absolute',
          top: -16,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#F59E0B',
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      >
        ?
      </div>
    )}
    <svg width="38" height="68" viewBox="0 0 38 68">
      <circle cx="19" cy="14" r="10" fill={color} />
      <rect x="6" y="27" width="26" height="36" rx="11" fill={color} />
    </svg>
  </div>
);

// ============================================================================
// SCENE 1: Prediabetes: Are You at Risk? (0:00 - 0:16 | 480 frames)
// US-specific references removed -> Global / community framing
// ============================================================================
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const highlightPeople = frame >= 75;
  const showQuestions = frame >= 180;
  const showNoSymptoms = frame >= 280;

  let caption = 'Imagine a common health condition affecting more than 1 in 3 adults worldwide.';
  if (frame >= 180 && frame < 280) {
    caption = 'And about 8 in 10 people who have it do not even know it.';
  } else if (frame >= 280) {
    caption = "It's called prediabetes, and it usually causes no warning signs at all.";
  }

  // Highlight 9 out of 25 people (~36%, matching global 1 in 3+ prevalence)
  const highlightedIndices = new Set([2, 4, 6, 8, 11, 13, 17, 20, 23]);
  const questionIndices = new Set([2, 4, 6, 8, 11, 13, 17]);

  return (
    <SlideShell title="Prediabetes: Are You at Risk?" caption={caption}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 130, width: '100%' }}>
        {/* Left: 5x5 Crowd Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px 26px',
            padding: 24,
          }}
        >
          {Array.from({ length: 25 }).map((_, idx) => {
            const delay = idx * 1.5;
            const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const isAffected = highlightPeople && highlightedIndices.has(idx);
            const hasQ = showQuestions && questionIndices.has(idx);

            return (
              <div key={idx} style={{ opacity, transform: 'scale(1.15)' }}>
                <PersonIcon
                  color={isAffected ? PALETTE.coral : PALETTE.navy}
                  showQuestion={hasQ}
                />
              </div>
            );
          })}
        </div>

        {/* Right: Global Callout Stats */}
        <div style={{ maxWidth: 620 }}>
          <div
            style={{
              opacity: interpolate(frame, [65, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame, [65, 85], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
            }}
          >
            <div style={{ fontFamily: SERIF, fontSize: 108, fontWeight: 700, color: PALETTE.coral, lineHeight: 1 }}>
              More than 1 in 3
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 700, color: PALETTE.navy, marginTop: 10 }}>
              adults worldwide have prediabetes
            </div>
          </div>

          <div
            style={{
              marginTop: 34,
              opacity: interpolate(frame, [175, 195], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 700, color: PALETTE.amber }}>
              8 in 10 don’t know it
            </div>
          </div>

          {showNoSymptoms && (
            <div
              style={{
                marginTop: 22,
                opacity: interpolate(frame, [280, 300], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            >
              <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 700, color: PALETTE.teal }}>
                Usually has no symptoms
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideShell>
  );
};

// ============================================================================
// SCENE 2: What Is Prediabetes? (0:16 - 0:32 | 480 frames)
// Animated A1C Semicircular Gauge
// ============================================================================
const Scene2WhatIsIt: React.FC = () => {
  const frame = useCurrentFrame();

  // Needle sweeps from Normal (-55 deg) -> Prediabetes (0 deg) -> Diabetes (+55 deg) -> settles on Prediabetes (0 deg)
  let needleAngle = -55;
  if (frame < 120) {
    needleAngle = -55;
  } else if (frame < 220) {
    needleAngle = interpolate(frame, [120, 160], [-55, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: 'clamp',
    });
  } else if (frame < 310) {
    needleAngle = interpolate(frame, [220, 260], [0, 55], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: 'clamp',
    });
  } else {
    needleAngle = interpolate(frame, [310, 350], [55, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateRight: 'clamp',
    });
  }

  let caption = 'Prediabetes means your blood sugar is higher than normal, but not yet high enough to be diabetes.';
  if (frame >= 90 && frame < 150) {
    caption = 'A simple blood test called A1C shows your 3-month average blood sugar.';
  } else if (frame >= 150 && frame < 230) {
    caption = 'Below 5.7% is normal. Between 5.7% and 6.4% is prediabetes.';
  } else if (frame >= 230) {
    caption = 'And 6.5% or higher is diabetes.';
  }

  return (
    <SlideShell title="What Is Prediabetes?" caption={caption}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 90, width: '100%' }}>
          {/* Left Blood Drop Icon */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: interpolate(frame, [70, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <svg width="90" height="120" viewBox="0 0 90 120">
              <path
                d="M45 8 C45 8 10 55 10 80 C10 100 26 114 45 114 C64 114 80 100 80 80 C80 55 45 8 45 8 Z"
                fill={PALETTE.coral}
              />
              <path
                d="M32 75 C32 86 38 94 46 96"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
            <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: PALETTE.navy, marginTop: 12 }}>
              A1C Blood Test
            </div>
          </div>

          {/* Center Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="640" height="320" viewBox="0 0 640 320">
              {/* Teal Normal Arc */}
              <path
                d="M 110 260 A 210 210 0 0 1 235 68"
                fill="none"
                stroke={PALETTE.teal}
                strokeWidth="44"
              />
              {/* Amber Prediabetes Arc */}
              <path
                d="M 243 65 A 210 210 0 0 1 397 65"
                fill="none"
                stroke={PALETTE.amber}
                strokeWidth="44"
              />
              {/* Coral Diabetes Arc */}
              <path
                d="M 405 68 A 210 210 0 0 1 530 260"
                fill="none"
                stroke={PALETTE.coral}
                strokeWidth="44"
              />

              {/* Arc Labels */}
              <text x="55" y="135" fill={PALETTE.teal} fontSize="28" fontWeight="700" fontFamily={SERIF}>
                Normal
              </text>
              <text x="242" y="28" fill={PALETTE.amber} fontSize="28" fontWeight="700" fontFamily={SERIF}>
                Prediabetes
              </text>
              <text x="485" y="135" fill={PALETTE.coral} fontSize="28" fontWeight="700" fontFamily={SERIF}>
                Diabetes
              </text>

              {/* Animated Needle */}
              <g transform={`translate(320, 260) rotate(${needleAngle})`}>
                <line x1="0" y1="0" x2="0" y2="-165" stroke={PALETTE.navy} strokeWidth="9" strokeLinecap="round" />
                <circle cx="0" cy="0" r="18" fill={PALETTE.navy} />
              </g>
            </svg>

            <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: PALETTE.navy, letterSpacing: 1 }}>
              3-MONTH BLOOD SUGAR (A1C)
            </div>
          </div>

          <div style={{ width: 140 }} />
        </div>

        {/* Bottom Legend Row */}
        <div
          style={{
            display: 'flex',
            gap: 64,
            marginTop: 34,
            opacity: interpolate(frame, [110, 135], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: PALETTE.teal }} />
            <span style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: PALETTE.navy }}>
              Normal: Below 5.7%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: PALETTE.amber }} />
            <span style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: PALETTE.navy }}>
              Prediabetes: 5.7% – 6.4%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: PALETTE.coral }} />
            <span style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: PALETTE.navy }}>
              Diabetes: 6.5% or higher
            </span>
          </div>
        </div>
      </div>
    </SlideShell>
  );
};

// ============================================================================
// SCENE 3: What Happens Inside the Body (0:32 - 0:48 | 480 frames)
// Healthy Insulin Key vs. Insulin Resistance
// ============================================================================
const Scene3InsideBody: React.FC = () => {
  const frame = useCurrentFrame();

  const sugarMoveHealthy = interpolate(frame, [60, 160], [0, 250], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const arrowHeight = interpolate(frame, [210, 290], [0, 160], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let caption = 'Normally, insulin acts like a key that lets sugar move from your blood into your cells for energy.';
  if (frame >= 180) {
    caption = 'With insulin resistance, your cells stop responding well—so sugar builds up in your blood.';
  }

  return (
    <SlideShell title="What Happens Inside the Body" caption={caption}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 140, width: '100%' }}>
        {/* Left: Healthy Cell */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 700, color: PALETTE.teal, marginBottom: 34 }}>
            Healthy Body
          </div>

          <div style={{ position: 'relative', width: 520, height: 260, display: 'flex', alignItems: 'center' }}>
            {/* Sugar Dots Moving Into Cell */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transform: `translateX(${sugarMoveHealthy}px)`,
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#F59E0B',
                  }}
                />
              ))}
            </div>
            <div style={{ position: 'absolute', left: -12, bottom: 10, fontFamily: SERIF, fontSize: 26, color: PALETTE.slate }}>
              sugar
            </div>

            {/* Insulin Key Bridge */}
            <div
              style={{
                position: 'absolute',
                left: 110,
                backgroundColor: PALETTE.blue,
                color: PALETTE.white,
                fontFamily: SERIF,
                fontSize: 26,
                fontWeight: 700,
                padding: '12px 26px',
                borderRadius: 999,
                zIndex: 3,
              }}
            >
              insulin
            </div>

            {/* Cell Box */}
            <div
              style={{
                marginLeft: 'auto',
                width: 340,
                height: 230,
                border: `5px solid ${PALETTE.teal}`,
                borderRadius: 28,
                backgroundColor: PALETTE.white,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 22,
              }}
            >
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: PALETTE.navy }}>Cell</span>
            </div>
          </div>

          <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: PALETTE.teal, marginTop: 26 }}>
            Sugar enters cells for energy
          </div>
        </div>

        {/* Right: Insulin Resistance */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 700, color: PALETTE.coral, marginBottom: 34 }}>
            Insulin Resistance
          </div>

          <div style={{ position: 'relative', width: 540, height: 260, display: 'flex', alignItems: 'center' }}>
            {/* Rising Blood Sugar Arrow */}
            {arrowHeight > 0 && (
              <svg
                width="44"
                height="200"
                style={{ position: 'absolute', left: -45, bottom: 35 }}
              >
                <line
                  x1="22"
                  y1="190"
                  x2="22"
                  y2={190 - arrowHeight}
                  stroke={PALETTE.coral}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <polygon
                  points={`22,${176 - arrowHeight} 10,${196 - arrowHeight} 34,${196 - arrowHeight}`}
                  fill={PALETTE.coral}
                />
              </svg>
            )}

            {/* Blocked Sugar Dots Staying Outside */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginLeft: 16 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#F59E0B',
                  }}
                />
              ))}
            </div>
            <div style={{ position: 'absolute', left: 4, bottom: 10, fontFamily: SERIF, fontSize: 26, color: PALETTE.slate }}>
              sugar
            </div>

            {/* Blocked Insulin Key with Red X */}
            <div
              style={{
                position: 'absolute',
                left: 120,
                backgroundColor: '#CBD5E1',
                color: PALETTE.white,
                fontFamily: SERIF,
                fontSize: 26,
                fontWeight: 700,
                padding: '12px 26px',
                borderRadius: 999,
                zIndex: 3,
              }}
            >
              insulin
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: PALETTE.coral,
                  fontSize: 48,
                  fontWeight: 900,
                }}
              >
                ✕
              </span>
            </div>

            {/* Cell Box */}
            <div
              style={{
                marginLeft: 'auto',
                width: 340,
                height: 230,
                border: `5px solid ${PALETTE.coral}`,
                borderRadius: 28,
                backgroundColor: PALETTE.white,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: 22,
              }}
            >
              <span style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: PALETTE.navy }}>Cell</span>
            </div>
          </div>

          <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: PALETTE.coral, marginTop: 26 }}>
            Sugar builds up in the blood
          </div>
        </div>
      </div>
    </SlideShell>
  );
};

// ============================================================================
// SCENE 4: What Raises Your Risk? (0:48 - 1:10 | 660 frames)
// Combined Tighter Visual Sequence (Unchangeable + Lifestyle + Medical History)
// Simple everyday language throughout (no jargon like "gestational diabetes")
// ============================================================================
const Scene4RiskFactors: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groups = [
    {
      header: 'Factors You Can’t Change',
      badgeBg: PALETTE.coral,
      borderColor: PALETTE.coral,
      delay: 15,
      items: [
        { title: 'Age 45 or Older', desc: 'Risk naturally rises as we get older' },
        { title: 'Family History', desc: 'A parent or sibling with type 2 diabetes' },
        { title: 'Higher-Risk Backgrounds', desc: 'South Asian, Middle Eastern, African, Hispanic, or Indigenous heritage' },
      ],
    },
    {
      header: 'Daily Habits You Can Change',
      badgeBg: PALETTE.teal,
      borderColor: PALETTE.teal,
      delay: 180,
      items: [
        { title: 'Extra Belly Weight', desc: 'Carrying extra weight around the waist' },
        { title: 'Low Physical Activity', desc: 'Sitting too much or little regular movement' },
        { title: 'Sugary Foods & Poor Sleep', desc: 'Sweet drinks, processed snacks, smoking, or short sleep' },
      ],
    },
    {
      header: 'Related Health History',
      badgeBg: PALETTE.blue,
      borderColor: PALETTE.blue,
      delay: 360,
      items: [
        { title: 'High Blood Pressure or Cholesterol', desc: 'Elevated blood pressure or unhealthy blood fats' },
        { title: 'High Blood Sugar During Pregnancy', desc: 'A past history of pregnancy-related high blood sugar' },
        { title: 'PCOS or Heart History', desc: 'Polycystic ovary syndrome or past heart/stroke issues' },
      ],
    },
  ];

  let caption = 'Some risk factors cannot be changed, like age over 45, family history, or ethnic background.';
  if (frame >= 180 && frame < 360) {
    caption = 'Other risks come from daily habits you can improve—like extra belly weight, low activity, sugary drinks, or poor sleep.';
  } else if (frame >= 360) {
    caption = 'Health history also matters, including high blood pressure, abnormal cholesterol, PCOS, or high blood sugar during pregnancy.';
  }

  return (
    <SlideShell
      title="What Raises Your Risk?"
      subtitleBadge={{ text: 'Risk Factors Add Up Over Time', bg: PALETTE.amber }}
      caption={caption}
    >
      <div style={{ display: 'flex', gap: 36, width: '100%', alignItems: 'stretch' }}>
        {groups.map((grp, gIdx) => {
          const scale = spring({
            frame: Math.max(0, frame - grp.delay),
            fps,
            config: { damping: 16, stiffness: 120 },
          });
          const opacity = interpolate(frame, [grp.delay, grp.delay + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={gIdx}
              style={{
                flex: 1,
                backgroundColor: PALETTE.white,
                border: `3px solid ${grp.borderColor}`,
                borderRadius: 24,
                padding: '28px 32px',
                boxShadow: '0 10px 26px rgba(15, 43, 70, 0.06)',
                transform: `scale(${scale})`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  backgroundColor: grp.badgeBg,
                  color: PALETTE.white,
                  fontSize: 21,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  padding: '10px 18px',
                  borderRadius: 12,
                  textAlign: 'center',
                  marginBottom: 22,
                }}
              >
                {grp.header}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
                {grp.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    style={{
                      borderBottom: iIdx < 2 ? `1px solid ${PALETTE.border}` : 'none',
                      paddingBottom: iIdx < 2 ? 16 : 0,
                    }}
                  >
                    <div style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 700, color: PALETTE.navy }}>
                      • {item.title}
                    </div>
                    <div style={{ fontSize: 21, color: PALETTE.slate, marginTop: 4, lineHeight: 1.35, paddingLeft: 20 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SlideShell>
  );
};

// ============================================================================
// SCENE 5: How Do You Find Out? (1:10 - 1:30 | 600 frames)
// Fixed Card Layout & Font Sizing + Normal & Prediabetes Ranges on All 3 Cards
// Single Clean Centered Footer Line (No Duplicate / Clipping)
// ============================================================================
const Scene5HowToFindOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tests = [
    {
      name: 'A1C Test',
      desc: 'Average blood sugar over 2–3 months',
      normal: 'Below 5.7%',
      prediabetes: '5.7% – 6.4%',
      delay: 30,
      icon: (
        <svg width="64" height="82" viewBox="0 0 90 120">
          <path
            d="M45 8 C45 8 10 55 10 80 C10 100 26 114 45 114 C64 114 80 100 80 80 C80 55 45 8 45 8 Z"
            fill={PALETTE.coral}
          />
        </svg>
      ),
    },
    {
      name: 'Fasting Glucose',
      desc: 'Blood sugar after not eating overnight',
      normal: 'Below 100 mg/dL',
      prediabetes: '100 – 125 mg/dL',
      delay: 140,
      icon: (
        <svg width="64" height="82" viewBox="0 0 70 100">
          <rect x="14" y="6" width="42" height="68" rx="10" fill={PALETTE.blue} />
          <rect x="21" y="14" width="28" height="20" rx="4" fill="#93C5FD" />
          <text x="35" y="29" textAnchor="middle" fill={PALETTE.navy} fontSize="13" fontWeight="800">
            110
          </text>
          <circle cx="28" cy="52" r="4" fill="#FFFFFF" />
          <circle cx="42" cy="52" r="4" fill="#FFFFFF" />
          <rect x="31" y="74" width="8" height="12" fill="#CBD5E1" />
          <path d="M35 86 C35 86 28 94 28 98 C28 102 31 104 35 104 C39 104 42 102 42 98 C42 94 35 86 35 86 Z" fill={PALETTE.coral} />
        </svg>
      ),
    },
    {
      name: 'Glucose Tolerance',
      desc: 'Blood sugar 2 hours after a sweet drink',
      normal: 'Below 140 mg/dL',
      prediabetes: '140 – 199 mg/dL',
      delay: 250,
      icon: (
        <svg width="64" height="82" viewBox="0 0 76 100">
          <polygon points="14,12 62,12 54,90 22,90" fill="none" stroke={PALETTE.navy} strokeWidth="4" />
          <polygon points="18,36 58,36 54,88 22,88" fill="#F59E0B" opacity="0.85" />
        </svg>
      ),
    },
  ];

  return (
    <SlideShell
      title="How Do You Find Out?"
      caption="The only way to know for sure is a simple blood test—ask your doctor how often you should be tested."
    >
      <div style={{ display: 'flex', gap: 36, width: '100%', alignItems: 'stretch', justifyContent: 'center' }}>
        {tests.map((t, idx) => {
          const scale = spring({
            frame: Math.max(0, frame - t.delay),
            fps,
            config: { damping: 16, stiffness: 120 },
          });
          const opacity = interpolate(frame, [t.delay, t.delay + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                maxWidth: 540,
                backgroundColor: PALETTE.white,
                border: `3px solid ${PALETTE.navy}`,
                borderRadius: 24,
                padding: '28px 28px',
                boxShadow: '0 10px 26px rgba(15, 43, 70, 0.06)',
                transform: `scale(${scale})`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ marginBottom: 12 }}>{t.icon}</div>

              <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 700, color: PALETTE.navy }}>
                {t.name}
              </div>

              {/* Reduced font size & comfortable padding so text fits cleanly inside card borders */}
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 22,
                  color: PALETTE.slate,
                  marginTop: 8,
                  marginBottom: 20,
                  lineHeight: 1.35,
                  padding: '0 8px',
                }}
              >
                {t.desc}
              </div>

              {/* Normal & Prediabetes Ranges Box */}
              <div
                style={{
                  width: '100%',
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    backgroundColor: PALETTE.tealLight,
                    borderLeft: `6px solid ${PALETTE.teal}`,
                    borderRadius: 10,
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 700, color: PALETTE.teal }}>Normal:</span>
                  <span style={{ fontSize: 21, fontWeight: 800, color: PALETTE.navy }}>{t.normal}</span>
                </div>

                <div
                  style={{
                    backgroundColor: PALETTE.amberLight,
                    borderLeft: `6px solid ${PALETTE.amber}`,
                    borderRadius: 10,
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 20, fontWeight: 700, color: PALETTE.amber }}>Prediabetes:</span>
                  <span style={{ fontSize: 21, fontWeight: 800, color: PALETTE.navy }}>{t.prediabetes}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SlideShell>
  );
};

// ============================================================================
// SCENE 6: The Good News: You Can Lower Your Risk (1:30 - 1:45 | 450 frames)
// 58% Risk Reduction & 3 Action Pillars
// ============================================================================
const Scene6GoodNews: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countProgress = interpolate(frame, [20, 110], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pct = Math.round(countProgress * 58);

  const pillars = [
    { text: 'Lose 5%–7% of body weight', delay: 140 },
    { text: '150 minutes of brisk activity a week', delay: 210 },
    { text: 'Eat more whole, high-fiber foods', delay: 280 },
  ];

  let caption = 'In the landmark Diabetes Prevention Program study, healthy lifestyle changes lowered type 2 diabetes risk by 58%.';
  if (frame >= 140) {
    caption = 'Losing 5% to 7% of body weight, walking 150 minutes a week, and eating whole foods can reverse prediabetes.';
  }

  return (
    <SlideShell title="The Good News: You Can Lower Your Risk" caption={caption}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 90, width: '100%' }}>
        {/* Left: 58% Counter */}
        <div style={{ flex: 0.9, textAlign: 'left' }}>
          <svg width="72" height="66" viewBox="0 0 72 66" style={{ marginBottom: 12 }}>
            <path
              d="M36 60 C36 60 6 40 6 20 C6 10 14 4 23 4 C29 4 34 8 36 13 C38 8 43 4 49 4 C58 4 66 10 66 20 C66 40 36 60 36 60 Z"
              fill={PALETTE.teal}
            />
          </svg>
          <div style={{ fontFamily: SERIF, fontSize: 132, fontWeight: 700, color: PALETTE.teal, lineHeight: 1 }}>
            {pct}%
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, color: PALETTE.navy, marginTop: 14, lineHeight: 1.3 }}>
            lower risk of type 2 diabetes with lifestyle changes
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: PALETTE.slate, marginTop: 14 }}>
            Diabetes Prevention Program Clinical Study
          </div>
        </div>

        {/* Right: 3 Action Pills */}
        <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {pillars.map((p, idx) => {
            const scale = spring({
              frame: Math.max(0, frame - p.delay),
              fps,
              config: { damping: 16, stiffness: 120 },
            });
            const opacity = interpolate(frame, [p.delay, p.delay + 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: PALETTE.white,
                  border: `3px solid ${PALETTE.navy}`,
                  borderRadius: 20,
                  padding: '26px 34px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  boxShadow: '0 8px 20px rgba(15, 43, 70, 0.05)',
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: PALETTE.teal,
                    color: PALETTE.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <span style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 700, color: PALETTE.navy }}>
                  {p.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};

// ============================================================================
// SCENE 7: Take Action Today + Community Purpose & References (1:45 - 2:00 | 450 frames)
// ============================================================================
const Scene7Closing: React.FC = () => {
  const frame = useCurrentFrame();

  const steps = [
    { text: 'Know your personal risk factors', delay: 15 },
    { text: 'Ask your doctor about a simple blood test', delay: 65 },
    { text: 'Move more, eat balanced meals, and sleep well', delay: 115 },
    { text: 'Small daily steps protect your health for years', delay: 165, accent: true },
  ];

  return (
    <SlideShell
      title="Take Action Today"
      caption="This video is created for community education and awareness only, and is not personal medical advice."
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 1320 }}>
        {/* Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', paddingLeft: 60 }}>
          {steps.map((s, idx) => {
            const opacity = interpolate(frame, [s.delay, s.delay + 18], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const x = interpolate(frame, [s.delay, s.delay + 18], [24, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 22,
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: s.accent ? '#67E8F9' : PALETTE.teal,
                    color: PALETTE.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 38,
                    fontWeight: 700,
                    color: s.accent ? PALETTE.teal : PALETTE.navy,
                  }}
                >
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Community Awareness Purpose & Scientific References Box */}
        <div
          style={{
            marginTop: 38,
            width: '100%',
            backgroundColor: PALETTE.white,
            border: `2px solid ${PALETTE.border}`,
            borderLeft: `8px solid ${PALETTE.teal}`,
            borderRadius: 16,
            padding: '20px 30px',
            opacity: interpolate(frame, [210, 235], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ fontSize: 21, color: PALETTE.navy, lineHeight: 1.45 }}>
            <strong>Purpose:</strong> Created to spread community awareness and help everyday people understand, prevent, and reverse prediabetes.
          </div>
          <div style={{ fontSize: 19, color: PALETTE.slate, marginTop: 8 }}>
            <strong>Scientific References:</strong> American Diabetes Association (ADA) Standards of Care in Diabetes &amp; CDC Prediabetes Prevention Guidelines.
          </div>
        </div>
      </div>
    </SlideShell>
  );
};

// ============================================================================
// MAIN COMPOSITION: Exactly 120 Seconds (3,600 Frames @ 30fps)
// ============================================================================
export const ExplainerVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bg }}>
      {/* 0:00 - 0:16 (480 frames): Hook & Global Prevalence */}
      <Sequence from={0} durationInFrames={480}>
        <Scene1Hook />
      </Sequence>

      {/* 0:16 - 0:32 (480 frames): What Is Prediabetes & A1C Gauge */}
      <Sequence from={480} durationInFrames={480}>
        <Scene2WhatIsIt />
      </Sequence>

      {/* 0:32 - 0:48 (480 frames): What Happens Inside the Body */}
      <Sequence from={960} durationInFrames={480}>
        <Scene3InsideBody />
      </Sequence>

      {/* 0:48 - 1:10 (660 frames): Combined Risk Factors */}
      <Sequence from={1440} durationInFrames={660}>
        <Scene4RiskFactors />
      </Sequence>

      {/* 1:10 - 1:30 (600 frames): How Do You Find Out? (Fixed Layout + Ranges) */}
      <Sequence from={2100} durationInFrames={600}>
        <Scene5HowToFindOut />
      </Sequence>

      {/* 1:30 - 1:45 (450 frames): The Good News (58% Reduction) */}
      <Sequence from={2700} durationInFrames={450}>
        <Scene6GoodNews />
      </Sequence>

      {/* 1:45 - 2:00 (450 frames): Take Action Today + Purpose & References */}
      <Sequence from={3150} durationInFrames={450}>
        <Scene7Closing />
      </Sequence>
    </AbsoluteFill>
  );
};

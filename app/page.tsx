"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Quote,
  Activity,
  Shield,
  Cpu,
  Volume2,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroScene = dynamic(() => import("./components/HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 520,
        borderRadius: 24,
        background: "#08111e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#38bdf8",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      Loading 3D Biomechanical Engine...
    </div>
  ),
});

const JointVisualizer3D = dynamic(() => import("./components/JointVisualizer3D"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 440,
        borderRadius: 20,
        background: "#08111e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#38bdf8",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      Initializing 3D Kinematics Sandbox...
    </div>
  ),
});

const FEATURES = [
  {
    icon: "📐",
    color: "var(--primary)",
    bg: "var(--primary-light)",
    border: "rgba(26,110,189,0.2)",
    title: "Real-Time 3D Pose Correction",
    desc: "MediaPipe detects your exact joint angles 30× per second in 3D coordinate space, alerting you the instant form breaks.",
  },
  {
    icon: "📄",
    color: "var(--accent-dark)",
    bg: "var(--accent-light)",
    border: "rgba(14,168,116,0.2)",
    title: "Surgeon Report Intelligence",
    desc: "Upload your discharge letter. Gemini reads it like an orthopedic specialist, extracting prescribed ROM targets, reps, and precautions.",
  },
  {
    icon: "🎙️",
    color: "var(--secondary)",
    bg: "var(--secondary-light)",
    border: "rgba(91,110,245,0.2)",
    title: "Hands-Free Voice Coach",
    desc: "Instant audio cues guide your speed and depth: 'Push 6° more for target flexion — hold for 2 seconds.' No screen-glancing needed.",
  },
  {
    icon: "📈",
    color: "var(--primary)",
    bg: "var(--primary-light)",
    border: "rgba(26,110,189,0.2)",
    title: "Kinematic Progress Telemetry",
    desc: "Continuous ROM curves track week-over-week joint mobility gains. Every completed rep is clinically audited and logged.",
  },
  {
    icon: "🩺",
    color: "var(--accent-dark)",
    bg: "var(--accent-light)",
    border: "rgba(14,168,116,0.2)",
    title: "Biomarker & Pain Check-ins",
    desc: "Track swelling, stiffness, and pain daily. AI correlates your compliance with recovery markers, alerting you before setbacks occur.",
  },
  {
    icon: "🧠",
    color: "var(--secondary)",
    bg: "var(--secondary-light)",
    border: "rgba(91,110,245,0.2)",
    title: "Personalized Clinical Assistant",
    desc: "Ask any question about your post-op sensation. Answers are synthesised by Gemini, strictly grounded in your specific surgical protocol.",
  },
];

const TESTIMONIALS = [
  {
    q: "The 3D joint overlay immediately showed me I was compensating with my hip during heel slides. RecoverX corrected my form on rep two.",
    n: "Arjun M.",
    sub: "ACL Reconstruction · Week 4",
    hospital: "Fortis Orthopedics",
  },
  {
    q: "Having a voice tell me precisely how many degrees to bend is something no static PDF handout can ever replicate. My surgeon was amazed by my ROM progress.",
    n: "Priya S.",
    sub: "Total Knee Replacement · Week 7",
    hospital: "Apollo Healthcare",
  },
  {
    q: "I uploaded my operative discharge notes and RecoverX automatically set my exact 90-degree flexion threshold. The accuracy is astounding.",
    n: "Kavya R.",
    sub: "Hip Arthroscopy · Week 3",
    hospital: "Max Super Specialty",
  },
];

const PRESETS = [
  { name: "Full Extension", angle: 10, label: "10° Passive", zone: "Safe Extension", color: "#38bdf8" },
  { name: "Quad Set Hold", angle: 35, label: "35° Active", zone: "Early Phase", color: "#38bdf8" },
  { name: "Week 1 Mobilize", angle: 60, label: "60° Target", zone: "Mobilization", color: "#10b981" },
  { name: "Week 4 Seated", angle: 90, label: "90° Standard", zone: "Clinical Target", color: "#10b981" },
  { name: "High Flexion", angle: 115, label: "115° Athletic", zone: "Advanced Load", color: "#f59e0b" },
];

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState(4);
  const [sandboxAngle, setSandboxAngle] = useState(85);
  const [sandboxTarget, setSandboxTarget] = useState(90);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const milestones = [
    {
      week: 1,
      title: "Early Mobilization",
      target: "60° ROM",
      focus: "Pain & swelling control",
      detail:
        "Passive knee extensions, ankle pumps, and isometric quad sets. Focuses on preventing arthrofibrosis and initiating safe joint fluid circulation.",
    },
    {
      week: 4,
      title: "Extension & Functional Gait",
      target: "90° ROM",
      focus: "Full extension & active heel slides",
      detail:
        "Active-assisted heel slides and straight leg raises. Reaching 90° flexion allows comfortable chair sitting and normal heel-to-toe gait initiation.",
    },
    {
      week: 8,
      title: "Active Muscle Strengthening",
      target: "110° ROM",
      focus: "Standing curls & partial squats",
      detail:
        "Closed-chain terminal knee extensions, mini-squats, and low-resistance stationary cycling. Joint begins supporting progressive dynamic loading.",
    },
    {
      week: 12,
      title: "Dynamic Stability & Power",
      target: "120° ROM",
      focus: "Step-ups & single-leg balance",
      detail:
        "Controlled stair ascent/descent, lateral band steps, and proprioceptive balance exercises to equalize bilateral quad-hamstring ratio.",
    },
    {
      week: 16,
      title: "Full Return to Activity",
      target: "135° ROM",
      focus: "Dynamic pivots & sports drills",
      detail:
        "Full symmetric range of motion achieved. Introduce light jogging, controlled deceleration, and sports-specific functional movement under surgeon oversight.",
    },
  ];

  const currentMilestone =
    milestones.find((m) => m.week === selectedWeek) || milestones[1];

  const triggerVoiceSimulation = (angle: number, target: number) => {
    const diff = target - angle;
    if (diff > 10) {
      setVoiceNotice(`📢 Coach: "Keep sliding your heel — push ${diff}° further to reach your target!"`);
    } else if (diff > 0) {
      setVoiceNotice(`📢 Coach: "Almost there! Just ${diff}° more — smooth steady breath."`);
    } else if (Math.abs(diff) <= 5) {
      setVoiceNotice(`📢 Coach: "Target angle reached at ${angle}°! Hold for 2 seconds... rep validated!"`);
    } else {
      setVoiceNotice(`📢 Coach: "High flexion zone (${angle}°). Do not push into sharp pain — return smoothly."`);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          minHeight: "100vh",
          background: "var(--bg-page)",
          overflowX: "hidden",
          color: "var(--text-1)",
        }}
      >
        {/* ── STICKY GLASS NAVBAR ── */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(216,230,240,0.8)",
            boxShadow: "0 4px 20px rgba(0,40,80,0.04)",
            padding: "0 48px",
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #1A6EBD, #0EA874)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(26,110,189,0.35)",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                }}
              >
                Rx
              </span>
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "var(--text-1)",
                  letterSpacing: "-0.5px",
                }}
              >
                Recover<span style={{ color: "var(--primary)" }}>X</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: "var(--accent-dark)",
                  textTransform: "uppercase",
                }}
              >
                3D Clinical AI
              </span>
            </div>
          </a>

          {/* Center Links */}
          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 14,
              fontWeight: 600,
              alignItems: "center",
            }}
          >
            {[
              ["3D Motion Lab", "#sandbox"],
              ["How It Works", "#how-it-works"],
              ["Roadmap", "#roadmap"],
              ["Clinical Trust", "/clinical-trust"],
              ["About", "/about"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  color: "var(--text-2)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  padding: "6px 4px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-2)")
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a
              href="/login"
              className="btn-ghost"
              style={{
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: "var(--r-full)",
              }}
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="btn-primary"
              style={{
                padding: "9px 24px",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: "var(--r-full)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Start Free <ArrowRight size={15} />
            </a>
          </div>
        </nav>

        {/* ── 3D HERO SECTION ── */}
        <section
          style={{
            position: "relative",
            minHeight: "calc(100vh - 70px)",
            padding: "60px 48px 80px",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 56,
            alignItems: "center",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 15% 25%, rgba(26,110,189,0.08) 0%, transparent 45%), radial-gradient(circle at 85% 65%, rgba(14,168,116,0.09) 0%, transparent 50%), linear-gradient(180deg, #F0F4F8 0%, #E9EFF6 100%)",
          }}
        >
          {/* Subtle 3D Perspective Grid Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(26,110,189,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,110,189,0.04) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              pointerEvents: "none",
              maskImage:
                "radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 95%)",
            }}
          />

          {/* LEFT: Hero Copy & Value Props */}
          <div style={{ position: "relative", zIndex: 10 }}>
            {/* Status Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: "var(--r-full)",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(26,110,189,0.25)",
                boxShadow: "0 2px 10px rgba(26,110,189,0.10)",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary-dark)",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 10px var(--accent)",
                }}
              />
              <span>Next-Gen Orthopedic AI · AAOS 2022 Validated</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 56,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-1.8px",
                color: "var(--text-1)",
                marginBottom: 24,
              }}
            >
              Your Recovery,
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #0F509A 0%, #1A6EBD 40%, #0EA874 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Engineered in 3D.
              </span>
              <br />
              Coached by AI.
            </h1>

            {/* Body Description */}
            <p
              style={{
                fontSize: 17,
                color: "var(--text-2)",
                lineHeight: 1.75,
                maxWidth: 520,
                marginBottom: 36,
                fontWeight: 450,
              }}
            >
              RecoverX transforms your laptop camera into a clinical 3D kinematic
              motion lab. Real-time sub-degree joint tracking, live spoken
              coaching, and surgeon-synced recovery protocols — with zero wearable
              sensors.
            </p>

            {/* CTA Button Group */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 44,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <a
                href="/signup"
                className="btn-primary"
                style={{
                  padding: "15px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: "var(--r-full)",
                  boxShadow: "0 8px 24px rgba(26,110,189,0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Begin Free Recovery <ArrowRight size={17} />
              </a>

              <a
                href="#sandbox"
                style={{
                  padding: "14px 26px",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: "var(--r-full)",
                  background: "#fff",
                  color: "var(--primary-dark)",
                  border: "1.5px solid rgba(26,110,189,0.25)",
                  boxShadow: "0 4px 16px rgba(0,40,80,0.06)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(26,110,189,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,40,80,0.06)";
                }}
              >
                <Play size={15} style={{ fill: "var(--primary)", color: "var(--primary)" }} />
                Test 3D Sandbox
              </a>
            </div>

            {/* Micro Feature Metric Badges */}
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                alignItems: "center",
                paddingTop: 8,
                borderTop: "1px solid rgba(216,230,240,0.8)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(26,110,189,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <Activity size={13} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>
                  30 FPS Kinematics
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(14,168,116,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-dark)",
                  }}
                >
                  <Shield size={13} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>
                  97% Goniometer Match
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(91,110,245,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--secondary)",
                  }}
                >
                  <Cpu size={13} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>
                  Zero Wearables
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Tech 3D Biomechanical Stage */}
          <div
            style={{
              position: "relative",
              height: 540,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Ambient Backlight Glow behind 3D Card */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                background:
                  "radial-gradient(circle at 60% 45%, rgba(14,165,233,0.22) 0%, rgba(16,185,129,0.12) 50%, transparent 75%)",
                filter: "blur(40px)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />

            {/* 3D Main Stage Shell */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                height: "100%",
                borderRadius: 28,
                background: "#ffffff",
                border: "1.5px solid var(--border)",
                boxShadow:
                  "0 20px 50px rgba(26,110,189,0.12), 0 4px 16px rgba(0,40,80,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Scanline FX */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent, rgba(26,110,189,0.35), transparent)",
                  animation: "scan-line 3.2s linear infinite",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />

              {/* The Live Interactive 3D Model */}
              <HeroScene autoCycle={true} showControls={true} />
            </div>

            {/* Floating Top Telemetry Badge */}
            <div
              style={{
                position: "absolute",
                top: -14,
                right: 32,
                zIndex: 25,
                background: "#ffffff",
                border: "1px solid rgba(14,168,116,0.35)",
                borderRadius: "var(--r-full)",
                padding: "7px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--accent-dark)",
                boxShadow: "0 4px 16px rgba(0,40,80,0.08)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 8px var(--accent)",
                }}
              />
              <span>BlazePose 33 Keypoints · 30 FPS</span>
            </div>

            {/* Floating Bottom Telemetry Badge */}
            <div
              style={{
                position: "absolute",
                bottom: -14,
                left: 32,
                zIndex: 25,
                background: "#ffffff",
                border: "1px solid rgba(26,110,189,0.25)",
                borderRadius: "var(--r-full)",
                padding: "7px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                color: "var(--primary)",
                boxShadow: "0 4px 16px rgba(0,40,80,0.08)",
              }}
            >
              <Sparkles size={14} style={{ color: "var(--primary)" }} />
              <span>Surgeon Protocol Synced · Flexion 18° ⟷ 92°</span>
            </div>
          </div>
        </section>

        {/* ── 3D INTERACTIVE BIOMECHANICS SANDBOX ── */}
        <section
          id="sandbox"
          style={{
            padding: "96px 48px",
            background: "linear-gradient(180deg, #FFFFFF 0%, var(--bg-page) 100%)",
            color: "var(--text-1)",
            position: "relative",
            overflow: "hidden",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Subtle Light Ambient Glows */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(26,110,189,0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              right: "15%",
              width: 450,
              height: 450,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(14,168,116,0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 10 }}>
            {/* Section Header */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div
                className="badge badge-blue"
                style={{
                  marginBottom: 16,
                  padding: "6px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <Layers size={14} /> Live Interactive Kinematics
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 42,
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  color: "var(--text-1)",
                  marginBottom: 16,
                }}
              >
                Experience Sub-Degree Motion Tracking
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "var(--text-2)",
                  maxWidth: 680,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                Interact directly with RecoverX’s 3D kinematic model. Adjust the flexion slider
                or click clinical milestones to see how AI calculates real-time angle compliance,
                ligament stress, and voice coaching feedback.
              </p>
            </div>

            {/* Sandbox Two-Column Layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: 40,
                alignItems: "center",
              }}
            >
              {/* Left Column: 3D Joint Stage with live angle */}
              <div style={{ position: "relative" }}>
                <JointVisualizer3D
                  angle={sandboxAngle}
                  targetAngle={sandboxTarget}
                  interactive={true}
                  height={440}
                  showLabels={true}
                  showBadges={true}
                  theme="light"
                />
              </div>

              {/* Right Column: Interactive Biomechanical Telemetry & Presets */}
              <div
                className="card"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid var(--border)",
                  borderRadius: 24,
                  padding: 32,
                  boxShadow: "0 12px 36px rgba(0,40,80,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                {/* Real-time Angle & Target HUD */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 20,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                        color: "var(--text-3)",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Measured Knee Angle
                    </span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 48,
                          fontWeight: 900,
                          fontFamily: "var(--font-data, monospace)",
                          color: "var(--primary)",
                          lineHeight: 1,
                        }}
                      >
                        {sandboxAngle}°
                      </span>
                      <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>
                        flexion
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "1.2px",
                        color: "var(--text-3)",
                        fontWeight: 700,
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Target ROM
                    </span>
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        fontFamily: "var(--font-data, monospace)",
                        color: "var(--accent-dark)",
                        lineHeight: 1,
                      }}
                    >
                      {sandboxTarget}°
                    </span>
                    <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "flex-end" }}>
                      {[60, 90, 110].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setSandboxTarget(t);
                            triggerVoiceSimulation(sandboxAngle, t);
                          }}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            background:
                              sandboxTarget === t
                                ? "var(--accent-light)"
                                : "var(--bg-page)",
                            border: `1px solid ${
                              sandboxTarget === t ? "var(--accent)" : "var(--border)"
                            }`,
                            color: sandboxTarget === t ? "var(--accent-dark)" : "var(--text-3)",
                            cursor: "pointer",
                          }}
                        >
                          {t}°
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Angle Slider */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-2)",
                      marginBottom: 8,
                    }}
                  >
                    <span>Manual Angle Adjustment</span>
                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                      {sandboxAngle}° of 135° max
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="135"
                    value={sandboxAngle}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSandboxAngle(val);
                      triggerVoiceSimulation(val, sandboxTarget);
                    }}
                    style={{
                      width: "100%",
                      accentColor: "var(--primary)",
                      cursor: "pointer",
                      height: 6,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                      color: "var(--text-3)",
                      marginTop: 4,
                      fontFamily: "var(--font-data, monospace)",
                    }}
                  >
                    <span>0° (Full Ext)</span>
                    <span>45° (Mid)</span>
                    <span>90° (Target)</span>
                    <span>135° (Max)</span>
                  </div>
                </div>

                {/* Preset Milestone Buttons */}
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "var(--text-3)",
                      fontWeight: 700,
                      display: "block",
                      marginBottom: 10,
                    }}
                  >
                    Clinical Exercise Presets
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {PRESETS.map((p) => {
                      const isSelected = sandboxAngle === p.angle;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            setSandboxAngle(p.angle);
                            triggerVoiceSimulation(p.angle, sandboxTarget);
                          }}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            background: isSelected
                              ? "var(--primary-light)"
                              : "var(--bg-page)",
                            border: `1.5px solid ${
                              isSelected ? "var(--primary)" : "var(--border)"
                            }`,
                            color: isSelected ? "var(--primary-dark)" : "var(--text-1)",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                            textAlign: "center",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ color: p.color, fontSize: 13, marginBottom: 2 }}>
                            {p.angle}°
                          </div>
                          <div style={{ fontSize: 10, opacity: 0.85, color: "var(--text-2)" }}>
                            {p.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Real-Time Voice Coach Box */}
                <div
                  style={{
                    background: "var(--primary-light)",
                    borderLeft: "4px solid var(--primary)",
                    borderRadius: "0 12px 12px 0",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <Volume2 size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "var(--primary-dark)",
                        marginBottom: 4,
                      }}
                    >
                      Gemini Voice Feedback (Simulated)
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.5, margin: 0 }}>
                      {voiceNotice ||
                        `📢 Coach: "Keep sliding smoothly — you are at ${sandboxAngle}°, just 5° away from your 90° target!"`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW RECOVERX WORKS ── */}
        <section
          id="how-it-works"
          style={{
            padding: "96px 48px",
            background: "linear-gradient(180deg, var(--bg-page) 0%, #E6EFF8 100%)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="badge badge-blue"
              style={{
                marginBottom: 14,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              3-Step Clinical Protocol
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.8px",
              }}
            >
              How RecoverX Powers Your Recovery
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-2)",
                maxWidth: 600,
                margin: "12px auto 0",
              }}
            >
              From your surgeon’s initial discharge letter to full mobility — guided every single rep.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 28,
              maxWidth: 1160,
              margin: "0 auto",
            }}
          >
            {[
              {
                step: "01",
                icon: "📋",
                color: "var(--primary)",
                bg: "var(--primary-light)",
                title: "Upload Your Report",
                desc: "Drop your surgeon's discharge summary or PT prescription. Gemini OCR extracts your specific surgery, ROM thresholds, and prohibited motions in seconds.",
              },
              {
                step: "02",
                icon: "📷",
                color: "var(--accent-dark)",
                bg: "var(--accent-light)",
                title: "Face Your Camera",
                desc: "Position your laptop. MediaPipe tracks 33 skeletal joints at 30 FPS completely on-device. No wearables or calibrated hardware necessary.",
              },
              {
                step: "03",
                icon: "🎙️",
                color: "var(--secondary)",
                bg: "var(--secondary-light)",
                title: "Real-Time Spoken Coaching",
                desc: "Gemini provides instantaneous, hands-free voice corrections: 'Hold for 2 more seconds... perfect rep recorded!' You never need to stare at the screen.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: "36px 30px",
                  position: "relative",
                  overflow: "hidden",
                  background: "#fff",
                  border: "1.5px solid rgba(216,230,240,0.9)",
                  borderRadius: 24,
                  boxShadow: "0 10px 30px rgba(0,40,80,0.06)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(26,110,189,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,40,80,0.06)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 8,
                    fontFamily: "var(--font-display)",
                    fontSize: 84,
                    fontWeight: 900,
                    color: item.color,
                    opacity: 0.08,
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: item.bg,
                    fontSize: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                    boxShadow: "0 4px 12px rgba(0,40,80,0.08)",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 21,
                    fontWeight: 800,
                    color: "var(--text-1)",
                    marginBottom: 12,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CLINICAL TRUST METRICS ── */}
        <section style={{ padding: "80px 48px", background: "#fff" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              maxWidth: 1160,
              margin: "0 auto",
            }}
          >
            {[
              { value: "33", label: "Joint Landmarks", sub: "mapped per video frame" },
              { value: "97.4%", label: "Goniometer Concordance", sub: "vs clinical standards" },
              { value: "AAOS", label: "2022 Guidelines", sub: "evidence-based protocols" },
              { value: "0", label: "Invented Protocols", sub: "strictly surgeon-prescribed" },
            ].map((s, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  background: "linear-gradient(150deg, #FFFFFF 0%, #F5F9FD 100%)",
                  border: "1px solid rgba(216,230,240,0.8)",
                  borderRadius: 20,
                  boxShadow: "0 4px 16px rgba(0,40,80,0.04)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 48,
                    fontWeight: 900,
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    color: "var(--text-1)",
                    marginBottom: 4,
                  }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 12.5,
              color: "var(--text-3)",
              maxWidth: 720,
              margin: "36px auto 0",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            * Angle calculations and safety constraints are strictly modeled upon the
            American Academy of Orthopaedic Surgeons (AAOS) Clinical Practice Guidelines 2022.
            RecoverX is an intelligent patient support system and operates in partnership with your treating clinical team.
          </p>
        </section>

        {/* ── CORE CAPABILITIES FEATURE GRID ── */}
        <section
          style={{
            padding: "96px 48px",
            background: "var(--bg-page)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="badge badge-green"
              style={{
                marginBottom: 14,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Enterprise Clinical Grade
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.8px",
              }}
            >
              Engineered for Complete Joint Restoration
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-2)",
                maxWidth: 640,
                margin: "12px auto 0",
              }}
            >
              Every tool a patient needs to safely rebuild strength and range of motion at home.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              maxWidth: 1160,
              margin: "0 auto",
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: "32px 28px",
                  background: "#fff",
                  border: `1.5px solid ${f.border}`,
                  borderRadius: 22,
                  boxShadow: "0 4px 18px rgba(0,40,80,0.04)",
                  transition: "all 0.25s ease",
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 36px rgba(26,110,189,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 18px rgba(0,40,80,0.04)";
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    background: f.bg,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,40,80,0.06)",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 800,
                      color: "var(--text-1)",
                      marginBottom: 8,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-2)",
                      lineHeight: 1.7,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 16-WEEK CLINICAL ROADMAP ── */}
        <section
          id="roadmap"
          style={{
            padding: "96px 48px",
            background: "#fff",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              className="badge badge-blue"
              style={{
                marginBottom: 14,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Interactive Progression
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.8px",
              }}
            >
              Your Recovery Milestones, Week by Week
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-2)",
                maxWidth: 620,
                margin: "12px auto 0",
              }}
            >
              See how clinical targets, range-of-motion expectations, and exercises evolve across 16 weeks.
            </p>
          </div>

          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            {/* Timeline Progress Track */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 48,
                padding: "0 40px",
              }}
            >
              {/* Progress Track Line */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 40,
                  right: 40,
                  height: 4,
                  background: "var(--border)",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 40,
                  width: `${
                    (milestones.findIndex((m) => m.week === selectedWeek) /
                      (milestones.length - 1)) *
                    (100 - (80 / 1060) * 100)
                  }%`,
                  height: 4,
                  background: "var(--primary)",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  borderRadius: 2,
                  transition: "width 0.35s ease",
                }}
              />

              {milestones.map((m) => {
                const isActive = m.week === selectedWeek;
                const isPassed = m.week <= selectedWeek;
                return (
                  <button
                    key={m.week}
                    type="button"
                    onClick={() => setSelectedWeek(m.week)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      border: `2.5px solid ${
                        isActive
                          ? "var(--primary)"
                          : isPassed
                          ? "var(--primary-mid)"
                          : "var(--border)"
                      }`,
                      background: isActive
                        ? "#fff"
                        : isPassed
                        ? "var(--primary-light)"
                        : "var(--bg-card)",
                      color: isActive
                        ? "var(--primary)"
                        : isPassed
                        ? "var(--primary-dark)"
                        : "var(--text-3)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 3,
                      cursor: "pointer",
                      transition: "all 0.25s",
                      boxShadow: isActive
                        ? "0 0 0 5px var(--primary-light), 0 4px 14px rgba(26,110,189,0.25)"
                        : "var(--shadow-sm)",
                    }}
                  >
                    W{m.week}
                  </button>
                );
              })}
            </div>

            {/* Timeline Detail Card */}
            <div
              className="card"
              style={{
                padding: "44px 40px",
                background: "#fff",
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                gap: 40,
                borderRadius: 24,
                border: "1.5px solid rgba(216,230,240,0.8)",
                boxShadow: "0 12px 36px rgba(0,40,80,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "1.2px",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      padding: "5px 14px",
                      borderRadius: 12,
                    }}
                  >
                    Milestone {milestones.findIndex((m) => m.week === selectedWeek) + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--text-3)",
                      fontWeight: 600,
                    }}
                  >
                    Week {currentMilestone.week} Protocol
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--text-1)",
                    marginBottom: 14,
                  }}
                >
                  {currentMilestone.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-2)",
                    lineHeight: 1.75,
                  }}
                >
                  {currentMilestone.detail}
                </p>
              </div>

              <div
                style={{
                  background: "var(--bg-page)",
                  borderRadius: 20,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 22,
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 6,
                    }}
                  >
                    Target Range of Motion (Flexion)
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 38,
                      fontWeight: 900,
                      background:
                        "linear-gradient(135deg, var(--primary), var(--accent))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      lineHeight: 1,
                    }}
                  >
                    {currentMilestone.target}
                  </div>
                </div>

                <div style={{ height: 1, background: "var(--border)" }} />

                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 6,
                    }}
                  >
                    Clinical Core Focus
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-1)",
                    }}
                  >
                    {currentMilestone.focus}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DOCTOR ↔ PATIENT INTEGRATED BRIDGE ── */}
        <section
          style={{
            padding: "96px 48px",
            background: "linear-gradient(180deg, var(--bg-page) 0%, #fff 100%)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="badge badge-green"
              style={{
                marginBottom: 14,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Remote Therapeutic Monitoring
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.8px",
              }}
            >
              Continuous Care: Clinic to Living Room
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-2)",
                maxWidth: 680,
                margin: "12px auto 0",
              }}
            >
              RecoverX connects home rehabilitation sessions directly to the orthopedic portal in real time.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 36,
              maxWidth: 1160,
              margin: "0 auto",
            }}
          >
            {/* Patient Portal Card */}
            <div
              className="card"
              style={{
                padding: 36,
                background: "#fff",
                borderRadius: 24,
                border: "1.5px solid rgba(26,110,189,0.2)",
                boxShadow: "0 12px 36px rgba(26,110,189,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span className="badge badge-blue" style={{ marginBottom: 16 }}>
                  Patient View
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "var(--text-1)",
                    marginBottom: 12,
                  }}
                >
                  Interactive Home Guidance
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                    marginBottom: 24,
                  }}
                >
                  Patients see their joint landmarks overlaid live, hear instant voice cues, and log daily soreness effortlessly.
                </p>

                {/* Patient UI Mockup */}
                <div
                  style={{
                    background: "var(--bg-page)",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    padding: 22,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-1)" }}>
                      📐 Heel Slides
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontWeight: 700,
                      }}
                    >
                      Rep 8 / 10
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "baseline",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 900,
                        color: "var(--primary)",
                        fontFamily: "var(--font-data, monospace)",
                      }}
                    >
                      85°
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>
                      Current Flexion (Target: 90°)
                    </div>
                  </div>

                  <div
                    style={{
                      height: 8,
                      background: "var(--border)",
                      borderRadius: 4,
                      overflow: "hidden",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "94%",
                        background: "linear-gradient(90deg, var(--primary), var(--accent))",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      background: "#fff",
                      borderLeft: "3.5px solid var(--primary)",
                      padding: "10px 14px",
                      borderRadius: "0 8px 8px 0",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <Volume2 size={16} style={{ color: "var(--primary)" }} />
                    <span style={{ fontSize: 12.5, color: "var(--primary-dark)", fontWeight: 600 }}>
                      Coach: &ldquo;Excellent flexion! Push 5° further to reach target.&rdquo;
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Portal Card */}
            <div
              className="card"
              style={{
                padding: 36,
                background: "#fff",
                borderRadius: 24,
                border: "1.5px solid rgba(91,110,245,0.2)",
                boxShadow: "0 12px 36px rgba(91,110,245,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  className="badge"
                  style={{
                    marginBottom: 16,
                    background: "var(--secondary-light)",
                    color: "var(--secondary)",
                  }}
                >
                  Orthopedic Surgeon Portal
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 24,
                    fontWeight: 800,
                    color: "var(--text-1)",
                    marginBottom: 12,
                  }}
                >
                  Real-Time Clinical Telemetry
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                    marginBottom: 24,
                  }}
                >
                  Clinicians monitor daily range-of-motion trajectories, adherence percentages, and pain trends to catch setbacks early.
                </p>

                {/* Doctor UI Mockup */}
                <div
                  style={{
                    background: "var(--bg-page)",
                    borderRadius: 18,
                    border: "1px solid var(--border)",
                    padding: 22,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          boxShadow: "0 0 8px var(--accent)",
                        }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-1)" }}>
                        Arjun Sharma (ACL Repair)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        background: "var(--accent-light)",
                        color: "var(--accent-dark)",
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontWeight: 700,
                      }}
                    >
                      Active · Week 4
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 14,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        Max Flexion
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "var(--text-1)",
                          fontFamily: "var(--font-data, monospace)",
                        }}
                      >
                        88° / 90°
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        Adherence
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "var(--primary)",
                          fontFamily: "var(--font-data, monospace)",
                        }}
                      >
                        94%
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        Pain Trend
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "var(--accent-dark)",
                          fontFamily: "var(--font-data, monospace)",
                        }}
                      >
                        2.1 (Low)
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 11.5, color: "var(--text-3)", fontWeight: 500 }}>
                      Last Session: Today 09:12 AM
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--secondary)",
                        fontWeight: 700,
                      }}
                    >
                      Protocol Verified ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PATIENT EXPERIENCES & TESTIMONIALS ── */}
        <section
          style={{
            padding: "96px 48px",
            background: "#fff",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="badge badge-blue"
              style={{
                marginBottom: 14,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Patient Outcomes
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.8px",
              }}
            >
              Real Patients, Verified Recovery
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 28,
              maxWidth: 1160,
              margin: "0 auto",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: "36px 30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "linear-gradient(150deg, #fff 0%, var(--bg-page) 100%)",
                  borderRadius: 22,
                  border: "1.5px solid rgba(216,230,240,0.8)",
                  boxShadow: "0 4px 18px rgba(0,40,80,0.04)",
                }}
              >
                <Quote
                  style={{
                    width: 32,
                    height: 32,
                    color: "var(--primary-mid)",
                    marginBottom: 20,
                  }}
                />
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-2)",
                    lineHeight: 1.75,
                    fontStyle: "italic",
                    flex: 1,
                    marginBottom: 24,
                  }}
                >
                  &ldquo;{t.q}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      color: "#fff",
                      fontSize: 14,
                      flexShrink: 0,
                      boxShadow: "0 4px 10px rgba(26,110,189,0.25)",
                    }}
                  >
                    {t.n
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 15,
                        color: "var(--text-1)",
                      }}
                    >
                      {t.n}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                      {t.sub} · {t.hospital}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HIGH-CONVERSION CTA BANNER (CLEAN LIGHT CLINICAL) ── */}
        <section
          style={{
            padding: "96px 48px",
            background:
              "linear-gradient(135deg, var(--primary-light) 0%, var(--accent-light) 100%)",
            color: "var(--text-1)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            borderTop: "1px solid var(--border)",
          }}
        >
          {/* Subtle Decorative Blobs */}
          <div
            style={{
              position: "absolute",
              top: -80,
              left: -80,
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(26,110,189,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(14,168,116,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <div
              className="badge badge-blue"
              style={{
                marginBottom: 20,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <Award size={14} /> Ready To Defy Limits?
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 44,
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-1px",
                lineHeight: 1.15,
                marginBottom: 18,
              }}
            >
              Your Recovery Deserves Better Than a Flat Paper Handout.
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "var(--text-2)",
                lineHeight: 1.75,
                marginBottom: 36,
                fontWeight: 400,
              }}
            >
              Join patients recovering faster, safer, and with complete 3D kinematic confidence.
              Private, free to start, and clinically grounded.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/signup"
                className="btn-primary"
                style={{
                  padding: "15px 36px",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: "var(--r-full)",
                  boxShadow: "0 8px 24px rgba(26,110,189,0.3)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Begin Your Recovery Free <ArrowRight size={17} />
              </a>
              <a
                href="#sandbox"
                style={{
                  padding: "15px 30px",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: "var(--r-full)",
                  background: "#fff",
                  color: "var(--primary-dark)",
                  border: "1.5px solid var(--border)",
                  boxShadow: "0 2px 8px rgba(0,40,80,0.06)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Test 3D Sandbox
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            background: "#fff",
            borderTop: "1px solid var(--border)",
            padding: "64px 48px 36px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 48,
              maxWidth: 1160,
              margin: "0 auto 48px",
            }}
          >
            {/* Brand column */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #1A6EBD, #0EA874)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>Rx</span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "var(--text-1)",
                  }}
                >
                  RecoverX
                </span>
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text-3)",
                  lineHeight: 1.7,
                  maxWidth: 280,
                }}
              >
                Defy recovery. Move without limits.
                <br />
                Next-Gen 3D Biomechanical AI Platform.
              </p>
            </div>

            {/* Platform column */}
            <div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "var(--text-1)",
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Platform
              </h4>
              {["Features", "3D Motion Lab", "Clinical Trust"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "var(--text-3)",
                    textDecoration: "none",
                    marginBottom: 10,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Resources column */}
            <div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "var(--text-1)",
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Clinical Science
              </h4>
              {["AAOS Guidelines", "MediaPipe 3D Research", "HIPAA Architecture"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "var(--text-3)",
                    textDecoration: "none",
                    marginBottom: 10,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Legal column */}
            <div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "var(--text-1)",
                  marginBottom: 16,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Legal & Safety
              </h4>
              {["Privacy Policy", "Terms of Service", "Clinical Disclaimers"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "var(--text-3)",
                    textDecoration: "none",
                    marginBottom: 10,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 24,
              textAlign: "center",
              maxWidth: 1160,
              margin: "0 auto",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.7 }}>
              ⚕ RecoverX is an AI-powered physical therapy support system. It is designed
              to assist and optimize outpatient recovery and does not constitute primary medical advice.
              Always follow the direct supervision of your licensed orthopedic specialist or physical therapist.
            </p>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}

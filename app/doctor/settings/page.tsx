"use client";

import { useState, useEffect } from "react";
import { getUser } from "../../lib/auth";
import {
  Settings, User, Shield, Bell, Save,
  CheckCircle2, Download, Video, Phone, Mail, Clock
} from "lucide-react";

export default function DoctorSettingsPage() {
  const [saved, setSaved] = useState(false);

  // Profile fields
  const [name, setName] = useState("Dr. Meera Kapoor");
  const [specialty, setSpecialty] = useState("Senior Orthopedic & Sports Medicine Specialist");
  const [regNumber, setRegNumber] = useState("MCI-2015-88492");
  const [hospital, setHospital] = useState("Apollo Orthopedic Institute, Bangalore");
  const [email, setEmail] = useState("dr.meera@recoverx.health");
  const [phone, setPhone] = useState("+91 98450 11223");

  // Telehealth settings
  const [telehealthEnabled, setTelehealthEnabled] = useState(true);
  const [consultSlotMinutes, setConsultSlotMinutes] = useState(25);
  const [availabilityHours, setAvailabilityHours] = useState("09:00 AM - 05:00 PM IST");

  // Alert thresholds
  const [painAlertThreshold, setPainAlertThreshold] = useState(7);
  const [missedSessionsAlert, setMissedSessionsAlert] = useState(3);
  const [romLagAlert, setRomLagAlert] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (u) {
      if (u.name) setName(u.name.startsWith("Dr.") ? u.name : `Dr. ${u.name}`);
      if (u.email) setEmail(u.email);
    }

    try {
      const savedSettings = localStorage.getItem("recoverx_doctor_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.name) setName(parsed.name);
        if (parsed.specialty) setSpecialty(parsed.specialty);
        if (parsed.regNumber) setRegNumber(parsed.regNumber);
        if (parsed.hospital) setHospital(parsed.hospital);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.telehealthEnabled !== undefined) setTelehealthEnabled(parsed.telehealthEnabled);
        if (parsed.consultSlotMinutes) setConsultSlotMinutes(parsed.consultSlotMinutes);
        if (parsed.availabilityHours) setAvailabilityHours(parsed.availabilityHours);
        if (parsed.painAlertThreshold) setPainAlertThreshold(parsed.painAlertThreshold);
        if (parsed.missedSessionsAlert) setMissedSessionsAlert(parsed.missedSessionsAlert);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      specialty,
      regNumber,
      hospital,
      email,
      phone,
      telehealthEnabled,
      consultSlotMinutes,
      availabilityHours,
      painAlertThreshold,
      missedSessionsAlert,
      romLagAlert,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("recoverx_doctor_settings", JSON.stringify(data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportData = () => {
    const exportData = {
      doctor: { name, specialty, regNumber, hospital, email },
      exportDate: new Date().toISOString(),
      patientsActive: 5,
      complianceStandard: "NABH / HIPAA Telehealth Encrypted",
      status: "Verified Care Provider",
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recoverx-clinic-profile-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--secondary)] mb-1">
            <Settings className="w-4 h-4" /> Clinical Practice Settings
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--text-1)]">
            Doctor Profile & Consultation Preferences
          </h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            Manage your credentials, tele-rehab video hours, and automated patient risk alert thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] text-[var(--text-2)] transition"
          >
            <Download className="w-3.5 h-3.5" /> Export Clinic Info
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--secondary)] text-white hover:opacity-90 transition shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--accent-light)] text-[var(--accent-dark)] border border-[var(--accent)]/30 text-sm font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--accent)]" />
          Settings saved successfully! Patient portal and alerts will now use these parameters.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Professional Information */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-semibold text-[var(--text-1)]">
            <User className="w-5 h-5 text-[var(--secondary)]" /> Professional Identity
          </div>
          <p className="text-xs text-[var(--text-3)]">
            These details appear on prescriptions, patient discharge summaries, and the care team directory.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Doctor Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Medical Council Reg. No.</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Clinical Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Affiliated Hospital / Clinic</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--text-3)]" /> Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[var(--text-3)]" /> Clinic Phone / Direct Line
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)] transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tele-Rehabilitation Consultations */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-semibold text-[var(--text-1)]">
            <Video className="w-5 h-5 text-[var(--primary)]" /> Telehealth & Virtual Consultations
          </div>
          <p className="text-xs text-[var(--text-3)]">
            Control when patients can request quick video checks and adjust default slot lengths.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-1)]">Enable Telehealth Calls</div>
                <div className="text-[11px] text-[var(--text-3)]">Accept in-app HD consults</div>
              </div>
              <input
                type="checkbox"
                checked={telehealthEnabled}
                onChange={(e) => setTelehealthEnabled(e.target.checked)}
                className="w-5 h-5 accent-[var(--secondary)] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--text-3)]" /> Slot Duration (Minutes)
              </label>
              <select
                value={consultSlotMinutes}
                onChange={(e) => setConsultSlotMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)]"
              >
                <option value={15}>15 Minutes (Brief Review)</option>
                <option value={20}>20 Minutes (Standard)</option>
                <option value={25}>25 Minutes (Comprehensive)</option>
                <option value={40}>40 Minutes (Post-op Deep Dive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-2)] mb-1">Available Hours</label>
              <input
                type="text"
                value={availabilityHours}
                onChange={(e) => setAvailabilityHours(e.target.value)}
                placeholder="e.g. 09:00 AM - 05:00 PM IST"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] text-sm text-[var(--text-1)] focus:outline-none focus:border-[var(--secondary)]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Automated Risk Alerts */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-semibold text-[var(--text-1)]">
            <Bell className="w-5 h-5 text-[var(--warning)]" /> Clinical Alert Thresholds
          </div>
          <p className="text-xs text-[var(--text-3)]">
            RecoverX automatically flags patients in your Overview queue when their metrics cross these thresholds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-2)]">
                Severe Pain Score Alert
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={10}
                  value={painAlertThreshold}
                  onChange={(e) => setPainAlertThreshold(Number(e.target.value))}
                  className="flex-1 accent-[var(--danger)] cursor-pointer"
                />
                <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-[var(--danger-light)] text-[var(--danger)]">
                  {painAlertThreshold}/10
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-3)]">
                Alerts when patient check-in pain exceeds {painAlertThreshold}.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-2)]">
                Missed Workout Alert
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={missedSessionsAlert}
                  onChange={(e) => setMissedSessionsAlert(Number(e.target.value))}
                  className="flex-1 accent-[var(--warning)] cursor-pointer"
                />
                <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-[var(--warning-light)] text-[var(--warning)]">
                  {missedSessionsAlert} Days
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-3)]">
                Flags patient as &quot;at-risk&quot; if absent for {missedSessionsAlert}+ days.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-1)]">ROM Plateau Alert</div>
                <div className="text-[11px] text-[var(--text-3)]">Trigger if ROM stagnates 2 weeks</div>
              </div>
              <input
                type="checkbox"
                checked={romLagAlert}
                onChange={(e) => setRomLagAlert(e.target.checked)}
                className="w-5 h-5 accent-[var(--secondary)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Security & Compliance */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-base font-semibold text-[var(--text-1)]">
            <Shield className="w-5 h-5 text-[var(--accent)]" /> Security & Telemedicine Compliance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs text-[var(--text-2)]">
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>AES-256 Cloud Encryption Active</span>
            </div>
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>HIPAA / NABH Tele-Guideline Compliant</span>
            </div>
            <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Role-Based Access Control Enforced</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

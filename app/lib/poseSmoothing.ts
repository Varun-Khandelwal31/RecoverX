/**
 * Stabilizes pose landmarks, joint angles, and rep detection against MediaPipe frame noise.
 * Eliminates visual skeleton jitter and provides responsive, accurate exercise kinematics.
 */

export type BodySide = "RIGHT" | "LEFT";

export type PoseLandmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

const DEFAULT_VISIBILITY_MIN = 0.5;

export function landmarkVisibility(lm: PoseLandmark | undefined): number {
  return lm?.visibility ?? 1;
}

export function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
  const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((rad * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

/**
 * Multi-landmark coordinate low-pass filter with velocity-adaptive smoothing.
 * Completely eliminates camera frame jitter and skeleton trembling while
 * instantly tracking intentional patient movements.
 */
export class LandmarkSmoother {
  private smoothedLandmarks: PoseLandmark[] = [];

  constructor(
    private readonly baseAlpha: number = 0.35,
    private readonly noiseDeadband: number = 0.002, // ~2px normalized threshold
  ) {}

  reset() {
    this.smoothedLandmarks = [];
  }

  update(landmarks: PoseLandmark[]): PoseLandmark[] {
    if (!landmarks || landmarks.length === 0) return landmarks;

    if (this.smoothedLandmarks.length !== landmarks.length) {
      this.smoothedLandmarks = landmarks.map((lm) => ({ ...lm }));
      return this.smoothedLandmarks;
    }

    const smoothed: PoseLandmark[] = new Array(landmarks.length);

    for (let i = 0; i < landmarks.length; i++) {
      const raw = landmarks[i];
      const prev = this.smoothedLandmarks[i];

      if (!raw || !prev) {
        smoothed[i] = raw;
        continue;
      }

      const dx = raw.x - prev.x;
      const dy = raw.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deadband: If landmark barely moved (sensor noise jitter), freeze or heavily damp
      if (dist < this.noiseDeadband) {
        smoothed[i] = {
          x: prev.x * 0.9 + raw.x * 0.1,
          y: prev.y * 0.9 + raw.y * 0.1,
          z: raw.z !== undefined && prev.z !== undefined ? prev.z * 0.9 + raw.z * 0.1 : raw.z,
          visibility: raw.visibility,
        };
      } else {
        // Dynamic responsiveness: when moving deliberately, increase alpha for 0-lag tracking
        const adaptiveAlpha = Math.min(0.75, Math.max(this.baseAlpha, this.baseAlpha + dist * 6));
        smoothed[i] = {
          x: prev.x + adaptiveAlpha * dx,
          y: prev.y + adaptiveAlpha * dy,
          z: raw.z !== undefined && prev.z !== undefined ? prev.z + adaptiveAlpha * (raw.z - prev.z) : raw.z,
          visibility: raw.visibility,
        };
      }
    }

    this.smoothedLandmarks = smoothed;
    return smoothed;
  }
}

/**
 * Exponential moving average with deadband threshold to stop angular flickering.
 */
export class EmaSmoother {
  private value: number | null = null;

  constructor(
    private readonly alpha: number = 0.28,
    private readonly deadband: number = 0.75, // in degrees
  ) {}

  reset() {
    this.value = null;
  }

  update(sample: number): number {
    if (this.value === null) {
      this.value = sample;
      return sample;
    }

    const diff = Math.abs(sample - this.value);
    // Ignore micro-fluctuations when patient is holding steady
    if (diff < this.deadband) {
      return this.value;
    }

    // Adaptive alpha: quick movements track fast, gentle holds stay rock-solid
    const adaptiveAlpha = Math.min(0.65, Math.max(this.alpha, diff / 35));
    this.value = adaptiveAlpha * sample + (1 - adaptiveAlpha) * this.value;
    return this.value;
  }
}

/**
 * Locks to the tracked leg using landmark visibility to prevent side-flipping.
 */
export class SideTracker {
  private side: BodySide = "RIGHT";
  private switchVotes = 0;

  constructor(
    private readonly visibilityMargin = 0.12,
    private readonly framesToSwitch = 15,
  ) {}

  getSide(): BodySide {
    return this.side;
  }

  reset(side: BodySide = "RIGHT") {
    this.side = side;
    this.switchVotes = 0;
  }

  update(lm: PoseLandmark[], visibilityMin = DEFAULT_VISIBILITY_MIN): BodySide | null {
    if (!lm || lm.length < 29) return null;

    const rightVis =
      (landmarkVisibility(lm[24]) + landmarkVisibility(lm[26]) + landmarkVisibility(lm[28])) / 3;
    const leftVis =
      (landmarkVisibility(lm[23]) + landmarkVisibility(lm[25]) + landmarkVisibility(lm[27])) / 3;

    if (rightVis < visibilityMin && leftVis < visibilityMin) return null;

    let preferred: BodySide;
    if (rightVis >= visibilityMin && leftVis >= visibilityMin) {
      if (rightVis >= leftVis + this.visibilityMargin) preferred = "RIGHT";
      else if (leftVis >= rightVis + this.visibilityMargin) preferred = "LEFT";
      else preferred = this.side;
    } else {
      preferred = rightVis >= leftVis ? "RIGHT" : "LEFT";
    }

    if (preferred === this.side) {
      this.switchVotes = 0;
      return this.side;
    }

    this.switchVotes += 1;
    if (this.switchVotes >= this.framesToSwitch) {
      this.side = preferred;
      this.switchVotes = 0;
    }
    return this.side;
  }
}

/**
 * Calculates raw knee angle for the selected side.
 */
export function kneeAngleForSide(
  lm: PoseLandmark[],
  side: BodySide,
  visibilityMin = DEFAULT_VISIBILITY_MIN,
): number | null {
  if (!lm) return null;
  const [hipIdx, kneeIdx, ankleIdx] = side === "RIGHT" ? [24, 26, 28] : [23, 25, 27];
  const hip = lm[hipIdx];
  const knee = lm[kneeIdx];
  const ankle = lm[ankleIdx];
  if (!hip || !knee || !ankle) return null;

  const vis = Math.min(
    landmarkVisibility(hip),
    landmarkVisibility(knee),
    landmarkVisibility(ankle),
  );
  if (vis < visibilityMin) return null;

  return calculateAngle(hip, knee, ankle);
}

/**
 * Exercise-aware angle calculation (Knee Flexion, Straight Leg Raise, Quad Sets, Heel Slides).
 */
export function calculateExerciseAngle(
  lm: PoseLandmark[],
  side: BodySide,
  exerciseKey: string,
  visibilityMin = DEFAULT_VISIBILITY_MIN,
): { angle: number; auxiliaryAngle?: number } | null {
  if (!lm) return null;
  const [shoulderIdx, hipIdx, kneeIdx, ankleIdx] =
    side === "RIGHT" ? [12, 24, 26, 28] : [11, 23, 25, 27];

  const shoulder = lm[shoulderIdx];
  const hip = lm[hipIdx];
  const knee = lm[kneeIdx];
  const ankle = lm[ankleIdx];

  if (!hip || !knee || !ankle) return null;

  const kneeVis = Math.min(
    landmarkVisibility(hip),
    landmarkVisibility(knee),
    landmarkVisibility(ankle),
  );
  if (kneeVis < visibilityMin) return null;

  const kneeAngle = calculateAngle(hip, knee, ankle);

  // For Straight Leg Raise: Patient lifts straight leg off ground.
  // We compute the hip flexion angle (torso-hip-knee), or leg elevation.
  if (exerciseKey.includes("straight-leg-raise") && shoulder) {
    const hipAngle = calculateAngle(shoulder, hip, knee);
    // When lying flat, torso-hip-knee is ~175-180 deg. As leg raises to 45 deg, angle decreases to ~135 deg.
    // Normalized elevation angle = 180 - hipAngle (0 deg when flat, 45 deg when raised)
    const elevation = Math.max(0, Math.min(90, Math.round(180 - hipAngle)));
    return { angle: elevation, auxiliaryAngle: kneeAngle };
  }

  // Standard knee exercises (Flexion, Heel Slides, Quad Sets, Terminal Knee Extension)
  return { angle: Math.round(kneeAngle) };
}

export type RepEvent = "rep_completed" | "target_reached" | null;

/**
 * Adaptive rep counter that configures thresholds dynamically based on the exercise target.
 */
export class RepCounter {
  private state: "start" | "target_reached" = "start";
  private targetHoldTime = 0;
  private lastUpdate = Date.now();
  private hasReportedTarget = false;

  constructor(
    private targetAngle: number = 90,
    private exerciseType: string = "knee-flexion",
  ) {}

  configure(targetAngle: number, exerciseType: string) {
    this.targetAngle = targetAngle;
    this.exerciseType = exerciseType;
    this.reset();
  }

  reset() {
    this.state = "start";
    this.targetHoldTime = 0;
    this.hasReportedTarget = false;
    this.lastUpdate = Date.now();
  }

  update(currentAngle: number): RepEvent {
    const now = Date.now();
    this.lastUpdate = now;

    const isStraightLegRaise = this.exerciseType.includes("straight-leg-raise");
    const isFlexionType = !isStraightLegRaise && this.targetAngle <= 100;

    if (isStraightLegRaise) {
      // Straight Leg Raise: Target e.g. 45° elevation.
      // Starts near floor (angle < 15°).
      const enterTarget = currentAngle >= this.targetAngle - 8;
      const returnStart = currentAngle <= 16;

      if (this.state === "start" && enterTarget) {
        this.state = "target_reached";
        if (!this.hasReportedTarget) {
          this.hasReportedTarget = true;
          return "target_reached";
        }
      } else if (this.state === "target_reached" && returnStart) {
        this.state = "start";
        this.hasReportedTarget = false;
        return "rep_completed";
      }
      return null;
    }

    if (isFlexionType) {
      // Flexion / Heel Slides:
      // Neutral / extended leg: knee angle > 135°.
      // Target reach: knee angle <= targetAngle + 8 (e.g. 98° for a 90° target).
      // Return: extends back out > 132°.
      const enterTarget = currentAngle <= this.targetAngle + 8;
      const returnExtended = currentAngle >= 135;

      if (this.state === "start" && enterTarget) {
        this.state = "target_reached";
        if (!this.hasReportedTarget) {
          this.hasReportedTarget = true;
          return "target_reached";
        }
      } else if (this.state === "target_reached" && returnExtended) {
        this.state = "start";
        this.hasReportedTarget = false;
        return "rep_completed";
      }
      return null;
    }

    // Default general angle threshold (e.g. Terminal Knee Extension / Quad Sets near 170°-180°)
    const targetDistance = Math.abs(currentAngle - this.targetAngle);
    if (this.state === "start" && targetDistance <= 8) {
      this.state = "target_reached";
      if (!this.hasReportedTarget) {
        this.hasReportedTarget = true;
        return "target_reached";
      }
    } else if (this.state === "target_reached" && targetDistance >= 25) {
      this.state = "start";
      this.hasReportedTarget = false;
      return "rep_completed";
    }

    return null;
  }
}

export function roundAngle(angle: number): number {
  return Math.round(angle);
}

/** Limits UI updates to maintain 60 FPS fluidity without micro-stutters. */
export function shouldEmitDisplayAngle(
  lastEmit: { time: number; value: number },
  rounded: number,
  minIntervalMs = 50,
  minDelta = 1,
): boolean {
  const now = Date.now();
  return (
    now - lastEmit.time >= minIntervalMs && Math.abs(rounded - lastEmit.value) >= minDelta
  );
}

/** Red-zone hysteresis to avoid flickering alerts at the threshold. */
export function redZoneState(
  current: boolean,
  deviation: number,
  enterAbove = 34,
  exitBelow = 26,
): boolean {
  if (!current && deviation > enterAbove) return true;
  if (current && deviation <= exitBelow) return false;
  return current;
}

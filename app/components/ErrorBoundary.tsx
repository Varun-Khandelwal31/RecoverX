"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RecoverX Clinical ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[360px] w-full flex-col items-center justify-center p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20 shadow-sm">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[var(--text-1)] mb-2">
            Module Temporarily Unavailable
          </h3>
          <p className="max-w-md text-sm text-[var(--text-3)] mb-6">
            A temporary display issue occurred while rendering this component. Your rehabilitation data is safe.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

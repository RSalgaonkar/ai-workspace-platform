"use client";

import {
  Component,
  ErrorInfo,
  ReactNode
} from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo
  ) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <div
            className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm"
            role="alert"
          >
            <h1 className="text-lg font-semibold text-slate-950">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Refresh the page or return to the dashboard to continue.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  // other props here
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex w-full h-screen justify-center items-center flex-col gap-6">
          <span className="md:text-4xl text-3xl text-red-600 font-semibold">
            Something terribly went wrong!
          </span>
          <button
            className="blue-button-filled-lg"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

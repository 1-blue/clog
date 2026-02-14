"use client";

import { Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@clog/libs";
import { Button } from "#/src/components/ui/button";

type AdminErrorBoundaryProps = {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
};

type AdminErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class AdminErrorBoundary extends Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("AdminErrorBoundary caught error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold">오류가 발생했습니다</h2>
        <p className="text-muted-foreground text-sm">
          {error.message || "페이지를 불러오는데 실패했습니다"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset}>다시 시도</Button>
        <Button variant="outline" onClick={() => router.push(routes.admin.url)}>
          홈으로
        </Button>
      </div>
    </div>
  );
};

export default AdminErrorBoundary;

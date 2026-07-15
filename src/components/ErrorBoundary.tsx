// DOC-7 AC-3: a rendering error in one screen must not blank out the whole
// app. A class boundary is still the only way to catch render errors in React.
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In a real app this would go to monitoring; console keeps it visible.
    console.error('Screen render error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <Alert
          type="error"
          showIcon
          data-testid="screen-error"
          message="Something went wrong on this screen"
          description="Try navigating to another page. Your saved data is safe."
        />
      );
    }
    return this.props.children;
  }
}

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert } from 'antd';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

// DOC-7 AC-3: a render error in one screen must not blank out the whole app.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('App error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          showIcon
          message="Something went wrong"
          description="Please reload the page."
        />
      );
    }
    return this.props.children;
  }
}

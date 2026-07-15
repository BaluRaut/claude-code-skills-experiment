// DOC-7 AC-3: a rendering error in one screen must not blank the whole app.
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

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
    // In a real app this would go to a logger; keep a console trace for dev.
    console.error('Screen crashed:', error, info);
  }

  private reset = (): void => {
    this.state = { error: null };
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <Result
          status="error"
          title="Something went wrong on this screen"
          subTitle={this.state.error.message}
          extra={
            <Button type="primary" onClick={this.reset}>
              Try again
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}

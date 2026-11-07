import { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { AlertTriangle, RotateCw } from 'lucide-react';

/**
 * React Error Boundary component.
 * Catches JavaScript errors anywhere in its child component tree,
 * logs the errors, and displays a fallback UI instead of crashing the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            px: 2,
            py: 4,
            width: '100%',
          }}
        >
          <Card
            sx={{
              maxWidth: 520,
              width: '100%',
              borderRadius: 4,
              textAlign: 'center',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(248, 113, 113, 0.15)',
                  color: '#F87171',
                  mb: 2,
                }}
              >
                <AlertTriangle size={32} strokeWidth={2} />
              </Box>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                Something went wrong
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                An unexpected error occurred while rendering the weather dashboard.
                {this.state.error?.message && (
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      mt: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      opacity: 0.8,
                    }}
                  >
                    {this.state.error.message}
                  </Box>
                )}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                startIcon={<RotateCw size={18} />}
                onClick={this.handleReset}
                sx={{ borderRadius: 3, px: 3, py: 1 }}
              >
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

import React, { useState } from 'react';
import { Button, Container, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FFC107',
    },
  },
});

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    setFirstOperand(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const handleEquals = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
        console.error('Calculation error:', error);
      } finally {
        setLoading(false);
      }
      setFirstOperand(null);
      setOperation(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <Paper elevation={3} style={{ padding: '1rem' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={display}
            InputProps={{
              readOnly: true,
              style: { fontSize: '2rem', textAlign: 'right' }
            }}
            margin="normal"
          />
          <Grid container spacing={1}>
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', 'C', '=', '+'].map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  color={['/', '*', '-', '+'].includes(btn) ? 'secondary' : 'primary'}
                  onClick={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '=') handleEquals();
                    else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                    else handleNumberClick(btn);
                  }}
                  disabled={loading}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
          {loading && <CircularProgress style={{ marginTop: '1rem' }} />}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
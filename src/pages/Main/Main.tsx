import React, { useState, useEffect } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import { useMetaMask } from '~/hooks/useMetaMask';
import axios from 'axios';
import { Paper, ThemeProvider, Typography, createTheme } from '@mui/material';

export default function Main() {

    const { wallet } = useMetaMask();
  const [tokenListData, setTokenListData] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const fetchData = async (url: string, setData: (data: any) => void) => {
    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBalanceData = (addr: string) => {
    const balanceUrl = `https://spicy-explorer.chiliz.com/api?module=account&action=balance&address=${addr}`;
    fetchData(balanceUrl, () => {});
  };

  const fetchTokenListData = (addr: string) => {
    const tokenListUrl = `https://spicy-explorer.chiliz.com/api?module=account&action=tokenlist&address=${addr}`;
    fetchData(tokenListUrl, setTokenListData);
  };

  useEffect(() => {
    if (wallet) {
      fetchBalanceData(wallet.accounts[0]);
      fetchTokenListData(wallet.accounts[0]);
      if (wallet.accounts[0]) {
        setIsConnected(true);
      }
    }
  }, [wallet]);

  return (

    <div >
            {isConnected ? (

                <div className='container'>
                    <ThemeProvider theme={darkTheme}>
                        <Paper className='container' elevation={10} variant="elevation" sx={{
                            width: 600,
                            height: 300,
                            borderRadius: 3,
                        }}>
                <div>
                

                                {tokenListData ? (
                                    <div>
                                        <h2>Token List Data:</h2>
                                        <ul>
                                            {Array.isArray(tokenListData.result) &&
                                                tokenListData.result.map((token: any) => (
                                                    <li key={token.contractAddress}>
                                                        <div className="token-entry">
                                                            <strong>Fan Token:</strong> {token.name}, <strong>Balance:</strong> {token.balance} &nbsp;
                                                            <Link to={`/FanToken_${token.symbol.toLowerCase()}`}>Go to exclusive rewards!</Link>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>


                        </Paper>
                    </ThemeProvider>
                </div>
            ) :
                <div className='container'>
                    <ThemeProvider theme={darkTheme}>
                        <Paper className='container' elevation={10} variant="elevation" sx={{
                            width: 300,
                            height: 200,
                            borderRadius: 3,
                        }}>
                            <Typography variant="h5" component="div">
                                Welcome to SpicyBets!
                            </Typography>
                            <Typography variant="body1" component="div" style={{ padding: '16px', textAlign: 'center' }}>
                                To get started, connect your wallet here:
                            </Typography>
                            <w3m-button />
                        </Paper>
                    </ThemeProvider>
                </div>
            }
    </div>
  )
}

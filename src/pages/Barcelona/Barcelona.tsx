import React, { useEffect, useState } from "react";
import "./Barcelona.css";
import { checkFanTokenAmount } from "~/utils";
import { useMetaMask } from "~/hooks/useMetaMask";
import {
  Button,
  CircularProgress,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IDKitWidget } from "@worldcoin/idkit";
import axios from "axios";
import team1Logo from "../../assets/FCB.jpeg";
import team2Logo from "../../assets/JUV.jpeg";
import ConfettiExplosion from 'react-confetti-explosion';


export default function Barcelona() {
  const worldAppID = import.meta.env.VITE_WLD_APP_ID;

  const { wallet } = useMetaMask();
  const [tokenAmount, setTokenAmount] = useState<number | null>(null);
  const [treeCount, setTreeCount] = useState(0); // State to track the number of trees planted
  const [numberOfTrees, setNumberOfTrees] = useState(1); // State for number of trees to plant
  const [totalTrees, seTtotalTrees] = useState(0);
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [betAmount, setBetAmount] = useState("");

      const [exploding, setExploding] = useState(false)

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const paperStyle = {
    minWidth: 250,
    height: 250,
    padding: "16px",
    margin: "8px",
  };

  const handleGetTokenAmount = async () => {
    let tempAmount = await checkFanTokenAmount("testBAR", wallet.accounts[0]);
    // console.log(tempAmount);
    setTokenAmount(Number(tempAmount));
  };

 
  useEffect(() => {
    handleGetTokenAmount();
  }, [wallet]);


  if (tokenAmount === null) {
    return (
      <div className="container">
        <CircularProgress />
      </div>
    );
  }

  const isSuccess = async (response: any) => {
    try {
      const reqBody = {
        merkle_root: response.merkle_root,
        nullifier_hash: response.nullifier_hash,
        proof: response.proof,
        credential_type: response.credential_type,
        action: "verify",
        signal: "login",
      };

      // Send the reqBody to the backend
      const backendUrl = "http://localhost:5000/verify";
      const backendResponse = await axios.post(backendUrl, reqBody);
      console.log("Backend response:", backendResponse.data);
      close;
    } catch (error) {
      console.error("Error during verification:", error);
      window.alert("Error during verification. Please try again.");
    }
  };

  const submitBet = () => {
    const team1ScoreValue = Number(team1Score);
    const team2ScoreValue = Number(team2Score);
    const betAmountValue = Number(betAmount);

    // Ensure all values are non-negative
    if (team1ScoreValue < 0 || team2ScoreValue < 0 || betAmountValue < 0) {
      alert("Scores and bet amount cannot be negative.");
      return;
    }
    console.log(
      `Bet submitted for scores - Team 1: ${team1Score}, Team 2: ${team2Score}`
    );
    // You would likely want to connect to a smart contract or backend service here
  };

  const onSuccess = async (response: any) => {
    console.log("done");
  };

  return (
    <>
      <div style={{ paddingTop: "68px" }}></div>
      {tokenAmount > 0 && (
        <>
        {exploding && <ConfettiExplosion />}
          <div className="barcelona-header">
            <h2>Barcelona SpicyBets</h2>

            {exploding && <ConfettiExplosion />}
            <ThemeProvider theme={darkTheme}>
               <div className="mini-container">
                 <Typography>
                   You have{" "}
                   <strong style={{ color: "#E74C3C" }}>
                     {tokenAmount} BAR
                   </strong>{" "}
                   tokens
                   <br />
                   <br />
                   <a href="#" className="custom-button">BUY TOKENs</a>
                 </Typography>
                  {exploding && <ConfettiExplosion />}
               </div>
            </ThemeProvider>
          </div>

          <ThemeProvider theme={darkTheme}>
            <div className="center-container">
              <div className="Reward-Div">
                <Paper style={paperStyle}>
                  This is the reward section <br></br>
                  you can exchange tokens for real rewards like tickets or merch
                </Paper>

                <div className="bettingCard">
                  <div className="team-logos-container">
                    <img
                      src={team1Logo}
                      alt="Team 1 Logo"
                      className="team-logo"
                    />
                    <img
                      src={team2Logo}
                      alt="Team 2 Logo"
                      className="team-logo"
                    />
                  </div>

                  <div className="score-prediction-container">
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={team1Score}
                      onChange={(e) => setTeam1Score(e.target.value)}
                      className="score-input"
                    />
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={team2Score}
                      onChange={(e) => setTeam2Score(e.target.value)}
                      className="score-input"
                    />
                  </div>
                  <div className="bet-amount-container">
                    <input
                      type="number"
                      placeholder="Bet Amount"
                      min="0"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="bet-amount-input"
                    />
                  </div>
                  <div
                    variant="contained"
                    onClick={submitBet}
                    className="submit-bet-button"
                  >
                    SUBMIT
                  </div>

                </div>

                <Paper style={paperStyle}>Mock Paper 3</Paper>
                <Paper style={paperStyle}>Mock Paper 4</Paper>
                <Paper style={paperStyle}>Mock Paper 5</Paper>
                <Paper style={paperStyle}>Mock Paper 6</Paper>
              </div>
              <div style={{ paddingTop: "50px" }}></div>
              <div className="Lottery-Div">
                <Paper style={paperStyle}>
                  Hier kommt irgendwas zur lottery rein, wie soll das aussehen?
                  <IDKitWidget
                    app_id={worldAppID}
                    action="verify"
                    signal="login"
                    handleVerify={isSuccess}
                    onSuccess={onSuccess}
                    credential_types={["orb"]}
                    enableTelemetry
                  >
                    {({ open }) => (
                      <button onClick={open}>Verify with World ID</button>
                    )}
                  </IDKitWidget>

                  <Button onClick={() => setExploding(false)}>Enter schmoney getter</Button>
                  <Button onClick={() => setExploding(true)}>Simulate win</Button>
                </Paper>
              </div>

              <div style={{ paddingTop: "50px" }}></div>

              <div className="Donation-Div">
                <Paper style={paperStyle}>
                  Test
                </Paper>
              </div>
            </div>
          </ThemeProvider>
        </>
      )}

      {tokenAmount == 0 && (
        <div className="container">
          <ThemeProvider theme={darkTheme}>
            <Paper
              className="container"
              elevation={10}
              variant="elevation"
              sx={{
                width: 300,
                height: 200,
                borderRadius: 3,
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" component="div">
                You do not have any Barcelona FanTokens!
              </Typography>
              <Link to="/">Go back</Link>
            </Paper>
          </ThemeProvider>
        </div>
      )}
    </>
  );
}

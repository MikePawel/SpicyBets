import React, { useEffect, useState } from "react";
import "./Barcelona.css";
import { checkFanTokenAmount } from "~/utils";
import { useMetaMask } from "~/hooks/useMetaMask";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IDKitWidget } from "@worldcoin/idkit";
import axios from "axios";
import { ethers } from "ethers";
import team1Logo from "../../assets/FCB.png";
import team2Logo from "../../assets/AM.png";
import team3Logo from "../../assets/GAL.png";
import team4Logo from "../../assets/IBFK.png";
import team5Logo from "../../assets/INTER-2.png";
import team6Logo from "../../assets/NAP.png";
import team7Logo from "../../assets/VCF.png";
import FanTokenGIF from "../../assets/FanToken.gif";
import PlayerImage from "../../assets/FanTokenIMG.webp";
import ConfettiExplosion from 'react-confetti-explosion';
import { useIDKit } from '@worldcoin/idkit'


const treePlantingTrackerABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getTreesPlanted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "plantTree",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTrees",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "treesPlanted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const erc20DepositAndSendABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Deposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Sent",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTokenBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "sendToAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const erc20ABI = [
    // The `approve` function is all that's needed for the approval transaction
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "type": "function"
    }
  ];

  const treePlantingTrackerAddress = "0xc214194FA4e72F2d7A57E2e6E98FB186e64D7975";
  const erc20DepositAndSendAddress = '0xe742c9808B2c190921e294E2ABd99c8E365638CE';
  const erc20TokenAddress = '0x63667746A7A005E45B1fffb13a78d0331065Ff7f';

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

  const [isHuman, setIsHuman] = useState(true)

  const { open, setOpen } = useIDKit()

  const [openDialogWin, setOpenDialogWin] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpenDialogWin = () => {
    setExploding(true)
    setOpenDialogWin(true);
  };
  const handleCloseDialogWin = () => {
    setExploding(false)
    setOpenDialogWin(false);
  };

  const [openDialogLoose, setOpenDialogLoose] = React.useState(false);


  const handleClickOpenDialogLoose = () => {
    setOpenDialogLoose(true);
  };

  const handleCloseDialogLoose = () => {
    setOpenDialogLoose(false);
  };



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

  const fetchTreeCount = async () => {
    if (wallet && wallet.accounts && wallet.accounts[0] && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          treePlantingTrackerAddress,
          treePlantingTrackerABI,
          provider
        );
        const count = await contract.getTreesPlanted(wallet.accounts[0]);
        setTreeCount(count.toNumber());
      } catch (error) {
        console.error("Error fetching tree count:", error);
      }
    }
  };

  const fetchTotalTree = async () => {
    if (wallet && wallet.accounts && wallet.accounts[0] && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          treePlantingTrackerAddress,
          treePlantingTrackerABI,
          provider
        );
        const count = await contract.totalTrees();
        seTtotalTrees(count.toNumber());
      } catch (error) {
        console.error("Error fetching tree count:", error);
      }
    }
  };

 
  useEffect(() => {
    handleGetTokenAmount();
    setOpen(true)

  }, [wallet]);


  if (tokenAmount === null) {
    return (
      <div className="container">
        <CircularProgress />
      </div>
    );
  }

  const handlePlantTree = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        treePlantingTrackerAddress,
        treePlantingTrackerABI,
        signer
      );

      // Calculate the amount to send (assuming 1 token per tree)
      const amountInWei = ethers.utils.parseEther(String(numberOfTrees));
      const tx = await contract.plantTree({ value: amountInWei });
      await tx.wait(); // Wait for the transaction to be mined

      // Fetch the updated tree count from the blockchain
      fetchTreeCount();
      fetchTotalTree();

      // Notify the user of a successful transaction
      alert(`Successfully planted ${numberOfTrees} tree(s)!`);
    } catch (error) {
      console.error("Error planting tree:", error);
      alert("Error planting tree");
    }
  };

  const incrementTrees = () => {
    setNumberOfTrees((prevCount) => prevCount + 1);
  };

  const decrementTrees = () => {
    setNumberOfTrees((prevCount) => Math.max(prevCount - 1, 1));
  };

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
      setIsHuman(true)
      close;
    } catch (error) {
      setIsHuman(false)
      console.error("Error during verification:", error);
      window.alert("Error during verification. Please try again.");
    }
  };

  const handleApprove = async (tokenAmount: string) => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
  
    // Convert the token amount to the correct format
    const tokenAmountInWei = ethers.utils.parseUnits(tokenAmount, 'ether'); // Replace 'ether' with the ERC20 token's decimals
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = provider.getSigner();
  
      // Create a new instance of the ERC20 contract with a signer
      const tokenContract = new ethers.Contract(erc20TokenAddress, erc20ABI, signer);
  
      // Call the approve function
      const tx = await tokenContract.approve(erc20DepositAndSendAddress, tokenAmount);
      await tx.wait(); // Wait for the transaction to be mined
  
      // Notify the user
      alert(`Approval successful for ${tokenAmount} tokens!`);
      return true; // Return true to indicate a successful approval
    } catch (error) {
      console.error('Error during approval:', error);
      alert('Error during approval. Please try again.');
      return false; // Return false to indicate a failed approval
    }
  };
  

  const submitBet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    const betAmountInTokenUnits = ethers.utils.parseUnits(betAmount, 'ether'); // Replace 'ether' with the token's decimals

    // First, check for and request approval if necessary
    const hasApproved = await handleApprove(betAmount);
    if (!hasApproved) {
      return; // Stop if the user has not approved the token transfer
    }
  
    // Convert the bet amount to the correct format, e.g., wei for ETH or the correct decimals for ERC20 tokens
    const betAmountIn6 = ethers.utils.parseUnits(betAmount, 1); // Replace 'ether' with the correct number of decimals if not dealing with ETH
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = provider.getSigner();
  
      // Create a new instance of the contract with a signer, which allows update methods
      const contract = new ethers.Contract(erc20DepositAndSendAddress, erc20DepositAndSendABI, signer);
  
      // Call the deposit function
      const tx = await contract.deposit(betAmount);
      await tx.wait(); // Wait for the transaction to be mined
  
      // After successful deposit
      alert(`Successfully deposited ${betAmount} tokens for betting!`);
    } catch (error) {
      console.error('Error during deposit:', error);
      alert('Error during deposit. Please try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
  
    // Convert the withdraw amount to the correct units if necessary
    // const withdrawAmountInTokenUnits = ethers.utils.parseUnits(withdrawAmount, 6);
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = provider.getSigner();
  
      // Create a new instance of the contract with a signer
      const contract = new ethers.Contract(erc20DepositAndSendAddress, erc20DepositAndSendABI, signer);
  
      // Call the withdraw function
      // Make sure to pass the correct parameters if the withdraw function requires any
      const tx = await contract.sendToAddress("0x7ce145E253EcAc49Ec0Aa66Fd733a443463C7A46", 1);
      await tx.wait(); // Wait for the transaction to be mined
  
      // Notify the user
      alert('Withdrawal successful!');
    } catch (error) {
      console.error('Error during withdrawal:', error);
      alert('Error during withdrawal. Please try again.');
    }
  };

  const onSuccess = async (response: any) => {
    console.log("done");
  };

  return (
    <>
      
      <div style={{ paddingTop: "68px" }}></div>
      {isHuman && <>  

        {tokenAmount > 0 && (
        <>

          <div className="barcelona-header">
            <h2>Barcelona SpicyBets</h2>

            <ThemeProvider theme={darkTheme}>
                 <Typography>
                   You have{" "}
                   <strong style={{ color: "#E74C3C" }}>
                     {tokenAmount} BAR
                   </strong>{" "}
                   tokens
                   <br />
                   <br />
                   <a href="#" className="header-button">BUY TOKENs</a>
                 </Typography>

            </ThemeProvider>
          </div>

          <ThemeProvider theme={darkTheme}>
            <div className="center-container">
              <div className="bet-container-row">
                <div className="bet-container">
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

                    <div style={{display:'flex'}}>

                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      SUBMIT
                    </div>
                    </Tooltip>
                    </div>

                  </div>

                  <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <img
                        src={team3Logo}
                        alt="Team 3 Logo"
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
                    <Tooltip title="The Odds of Barcelona winning are 67%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      SUBMIT
                    </div>
                    </Tooltip>

                  </div>

                  <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <img
                        src={team4Logo}
                        alt="Team 4 Logo"
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
                  <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <img
                        src={team5Logo}
                        alt="Team 5 Logo"
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
                  <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <img
                        src={team6Logo}
                        alt="Team 6 Logo"
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
                  <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <img
                        src={team7Logo}
                        alt="Team 7 Logo"
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
                </div>
              </div>

              <div class="column-container">
                <div class="text-column">
                  <h2>Your Text Goes Here</h2>
                  <p>This is some sample text. You can replace it with your own content.</p>
                </div>
                <div class="image-column">
                  <img src={PlayerImage} alt="Tokens"  />
                </div>
              </div>

              <div class="lottery-container">
                <div className="content">
                  Hier kommt irgendwas zur lottery rein, wie soll das aussehen?
                </div>
                <div className="gif-container">
                  <img src={FanTokenGIF} alt="FanToken GIF" style={{ width: '200px', height: '200px' }} />
                </div>
                  {!isHuman && <>
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
                  
                  </>}
                  {isHuman && <div>you are a human</div>}
                  

                  <Button onClick={() => setExploding(false)}>Enter schmoney getter</Button>
                  <Button onClick={() => setExploding(true)}>Simulate win</Button>
                </div>
              </div>


              <div style={{ paddingTop: "50px" }}></div>
              <div className="Lottery-Div">
                <Paper style={paperStyle}>
                  Try your luck!


                  <Dialog
                    fullScreen={fullScreen}
                    open={openDialogWin}
                    onClose={handleCloseDialogWin}
                    aria-labelledby="responsive-dialog-title"
                  >
                    <DialogTitle id="responsive-dialog-title">
                      {"CONTRATULATIONS, YOU WON"}&nbsp; &#127881; &#127881; &#127881;
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        You just doubled your money!
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialogWin} autoFocus>
                        Awesome!
                      </Button>
                    </DialogActions>
                  </Dialog>
                  {exploding && <ConfettiExplosion />}
                  <Button onClick={() => handleClickOpenDialogWin()}>Win Dialog</Button>


                  <Dialog
                    fullScreen={fullScreen}
                    open={openDialogLoose}
                    onClose={handleCloseDialogLoose}
                    aria-labelledby="responsive-dialog-title"
                  >
                    <DialogTitle id="responsive-dialog-title">
                      {"You lost :("}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Try your luck again to double your money!
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialogLoose} autoFocus>
                        Try again
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Button onClick={() => handleClickOpenDialogLoose()}>Loose Dialog</Button>
                </Paper>
              </div>

              <div style={{ paddingTop: "50px" }}></div>

              <div className="Donation-Div">
                <Paper style={paperStyle}>
                <Button variant="contained" onClick={() => handleWithdraw()} className="withdraw-button">
                   Withdraw   
                  </Button>
                  <div className="tree-interaction-container">
                    <div className="tree-counter">
                      <Button onClick={decrementTrees}>-</Button>
                      <span>{numberOfTrees}</span>
                      <Button onClick={incrementTrees}>+</Button>
                    </div>
                    <Button
                      variant="contained"
                      onClick={handlePlantTree}
                      className="tree-plant-button"
                    >
                      Plant a Tree
                    </Button>
                    <Typography className="trees-planted-text">
                      Trees Planted: {treeCount}
                      <br />
                      Total Trees: {totalTrees}
                    </Typography>
                  </div>
                </Paper>
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
      </>}
      {!isHuman && <>
        <div style={{display: 'flex', alignContent: 'center', alignItems: 'center', alignSelf: 'center', flexDirection: 'column'}}>
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
                You did not verify that you are a human yet!
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
              </Typography>
              <Link to="/">Go back</Link>
            </Paper>
          </ThemeProvider>
        </div>
        </>}
    </>
  );
}

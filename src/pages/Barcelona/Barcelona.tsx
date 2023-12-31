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
import team2Logo from "../../assets/ML.png";
import team3Logo from "../../assets/GAL.png";
import team4Logo from "../../assets/IBFK.png";
import team5Logo from "../../assets/INTER-2.png";
import team6Logo from "../../assets/NAP.png";
import team7Logo from "../../assets/VCF.png";
import FanTokenGIF from "../../assets/FanToken.gif";
import PlayerImage from "../../assets/FanTokenIMG.webp";
import Nouns from "../../assets/nounify.png";
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

const randomNumberABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "response",
				"type": "uint256"
			}
		],
		"name": "ReceivedUint256",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "response",
				"type": "uint256[]"
			}
		],
		"name": "ReceivedUint256Array",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"name": "RequestedUint256",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "size",
				"type": "uint256"
			}
		],
		"name": "RequestedUint256Array",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "airnode",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sponsorWallet",
				"type": "address"
			}
		],
		"name": "WithdrawalRequested",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "fulfillUint256",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "fulfillUint256Array",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "makeRequestUint256",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "size",
				"type": "uint256"
			}
		],
		"name": "makeRequestUint256Array",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_airnode",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_endpointIdUint256",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "_endpointIdUint256Array",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_sponsorWallet",
				"type": "address"
			}
		],
		"name": "setRequestParameters",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_airnodeRrp",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "_qrngUint256",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_qrngUint256Array",
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
		"name": "airnode",
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
		"inputs": [],
		"name": "airnodeRrp",
		"outputs": [
			{
				"internalType": "contract IAirnodeRrpV0",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endpointIdUint256",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endpointIdUint256Array",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "expectingRequestWithIdToBeFulfilled",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRandomNumber",
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
		"name": "getRandomNumberArray",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sponsorWallet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];


  const treePlantingTrackerAddress = "0xc214194FA4e72F2d7A57E2e6E98FB186e64D7975";
  const erc20DepositAndSendAddress = '0xe742c9808B2c190921e294E2ABd99c8E365638CE';
  const erc20TokenAddress = '0x63667746A7A005E45B1fffb13a78d0331065Ff7f';
  const randomNumberAddress = "0x27b82494f321FF605A95Ad6D16BB773EDFDC9195";

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
  const [betAmount2, setBetAmount2] = useState("");
  const [exploding, setExploding] = useState(false)
  const [requestId, setRequestId] = useState(null);
  const [currTime, setCurrTime] = useState("")

  const [isExploding, setIsExploding] = React.useState(false);

  const [isHuman, setIsHuman] = useState(false)

  const { open, setOpen } = useIDKit()

  const [openDialogWin, setOpenDialogWin] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [bet1, setBet1] = useState(false)
  const [bet2, setBet2] = useState(false)

  const handleClickOpenDialogWin = () => {
    setIsExploding(true)
    setExploding(true)
    setOpenDialogWin(true);
  };
  const handleCloseDialogWin = () => {
    setIsExploding(false)
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
    timeInSeconds()
    fetchTotalTree()
    fetchTreeCount()

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


  function timeInSeconds(){
    var currentDate = new Date();
    console.log(currentDate)
    var timestamp = currentDate.getTime();
    var timestampInSeconds = Math.floor(timestamp / 1000);
    console.log(String(timestampInSeconds).slice(0, -1))
    setCurrTime(String(timestampInSeconds))
  }

  const isSuccess = async (response: any) => {
    try {
      timeInSeconds()
      const reqBody = {
        merkle_root: response.merkle_root,
        nullifier_hash: response.nullifier_hash,
        proof: response.proof,
        credential_type: response.credential_type,
        action: "verify",
        // signal: 'time',
        signal: currTime,
      };

      // Send the reqBody to the backend
      const backendUrl = "http://localhost:5001/verify";
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

    if(bet1 == true){
      setBet2(true)
      throw new Error('we are done here!')
    }
    setBet1(true)
    
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

const handleRandomNumberRequest = async () => {
  setIsExploding(false)
  try {
    
      const providerUrl = 'https://arbitrum-goerli.infura.io/v3/a146daf63d93490995823f0910f50118'; // Replace with your provider
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);

      // Access the private key from the environment variable
      const privateKey = import.meta.env.VITE_PRIVATE_KEY;
      if (!privateKey) {
          throw new Error('Not found in environment variables');
      }
      const wallet = new ethers.Wallet(privateKey, provider);

      const qrngContract = new ethers.Contract(
          randomNumberAddress,
          randomNumberABI,
          wallet
      );

      // Call makeRequestUint256 to request a random number
      const requestTx = await qrngContract.makeRequestUint256();
      await requestTx.wait(); // Wait for the transaction to be mined

      console.log(`Random number request sent, transaction hash: ${requestTx.hash}`);
      // alert("Random number request sent. Waiting for fulfillment...");

      const randomNumber = await qrngContract.getRandomNumber();

      const randomNumberString = randomNumber.toString();
      const randomNumberBigInt = BigInt(randomNumberString);
      const result = randomNumberBigInt % BigInt(2) === BigInt(0) ? 0 : 1;

      console.log(`Random number (BigInt): ${randomNumberBigInt}, Result (0 or 1): ${result}`);
      if(result== 1){
        console.log("WIN")
        handleClickOpenDialogWin()
      }else{
        console.log("LOOSE")
        handleClickOpenDialogLoose()
      }
  } catch (error) {
      console.error("Error requesting random number:", error);
      alert("Error requesting random number. Please try again.");
  }
};

  const onSuccess = async (response: any) => {
    console.log("done");
  };

  const openLinkInNewWindow = () => {
    window.open('https://www.chiliz.net/exchange/CHZ/USDT', '_blank');
  };
  

  return (
    <>
      
      <div style={{ paddingTop: "68px" }}></div>
      {isHuman && <>  

        {tokenAmount > 0 && (
        <>

          <div className="barcelona-header">
            <h1>Barcelona SpicyBets</h1>

            <ThemeProvider theme={darkTheme}>
                 <Typography>
                   You have{" "}
                   <strong style={{ color: "#E74C3C" }}>
                     {tokenAmount} BAR
                   </strong>{" "}
                   tokens
                   <br />
                   <br />
                   <div onClick={openLinkInNewWindow} className="header-button">BUY TOKENs</div>
                 </Typography>

            </ThemeProvider>
          </div>

          <div className="column-container">
                <div className="text-column">
                <h2>Become Part of our Community!</h2>
                <p>Place bets on any game your team plays and amp up the excitement. Join our community for a thrilling sports experience. Immerse yourself in the game, feel the adrenaline, and connect with fellow enthusiasts. Betting makes every moment count!</p>

                </div>
                <div className="image-column">
                  <img src={PlayerImage} alt="Tokens"  />
                </div>
              </div>






          <ThemeProvider theme={darkTheme}>
            <div className="center-container">
              <div className="bet-container-row">
                <div className="bet-container">

                  {!bet1 && 

                    <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <span className="centered-colon">:</span>
                      <img
                        src={team3Logo}
                        alt="Team 3 Logo"
                        className="team-logo"
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
                      WIN
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      draw
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      LOSE
                    </div>
                    </Tooltip>

                    </div>

                    </div>
                  }
                  {!bet2 && <div>
                    
                  <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <span className="centered-colon">:</span>
                      <img
                        src={team7Logo}
                        alt="Team 7 Logo"
                        className="team-logo"
                      />
                    </div>


                    <div className="bet-amount-container">
                      <input
                        type="number"
                        placeholder="Bet Amount"
                        min="0"
                        value={betAmount2}
                        onChange={(e) => setBetAmount2(e.target.value)}
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
                      WIN
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      draw
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      LOSE
                    </div>
                    </Tooltip>

                    </div>

                    </div></div>}
                    <div className="bettingCard">
                    <div className="team-logos-container">
                      <img
                        src={team1Logo}
                        alt="Team 1 Logo"
                        className="team-logo"
                      />
                      <span className="centered-colon">:</span>
                      <img
                        src={team2Logo}
                        alt="Team 2 Logo"
                        className="team-logo"
                      />
                    </div>


                    <div className="bet-amount-container">
                      <input
                        type="number"
                        placeholder="Bet Amount"
                        min="0"
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
                      WIN
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      draw
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      LOSE
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
                      <span className="centered-colon">:</span>
                      <img
                        src={team4Logo}
                        alt="Team 4 Logo"
                        className="team-logo"
                      />
                    </div>


                    <div className="bet-amount-container">
                      <input
                        type="number"
                        placeholder="Bet Amount"
                        min="0"
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
                      WIN
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      draw
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      LOSE
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
                      <span className="centered-colon">:</span>
                      <img
                        src={team5Logo}
                        alt="Team 5 Logo"
                        className="team-logo"
                      />
                    </div>


                    <div className="bet-amount-container">
                      <input
                        type="number"
                        placeholder="Bet Amount"
                        min="0"
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
                      WIN
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      draw
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      LOSE
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
                      <span className="centered-colon">:</span>
                      <img
                        src={team6Logo}
                        alt="Team 6 Logo"
                        className="team-logo"
                      />
                    </div>


                    <div className="bet-amount-container">
                      <input
                        type="number"
                        placeholder="Bet Amount"
                        min="0"
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
                      WIN
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      draw
                    </div>
                    </Tooltip>
                    <Tooltip title="The Odds of Barcelona winning are 85%" arrow>
                    <div
                      variant="contained"
                      onClick={submitBet}
                      className="submit-bet-button"
                    >
                      LOSE
                    </div>
                    </Tooltip>

                    </div>

                    </div>
                
                </div>
              </div>

            

              <div className="lottery-container">

                <div style={{display: 'flex', flexDirection: 'column'}}>
                {isExploding && <ConfettiExplosion />}
                  
                <div className="lottery-text-column">
                  FLIP A COIN DOUBLE YOUR MONEY
                </div>
                {isExploding && <ConfettiExplosion />}
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'baseline', paddingTop: '40px'}}>
                  
                <div className="bet-amount-container">
                      <input
                        type="number"
                        placeholder="Bet Amount"
                        min="0"
                        className="bet-amount-input"
                      />
                    </div>

                    <div
                      variant="contained"
                      onClick={handleRandomNumberRequest}
                      className="submit-bet-button"
                    >
                      FLIP
                    </div>
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
                    {isExploding && <ConfettiExplosion />}

                </div>

                </div>

                

                <div className="lottery-image-column">
                  <div className="gif-container">
                    <img src={FanTokenGIF} alt="FanToken GIF" style={{ width: '400px', height: '400px' }} />
                  </div>
                  {exploding && <ConfettiExplosion />}
                </div>
                </div>
              </div>



            <div className="column-container">
              <div className="text-column">
                <h2>Feeling green today? Plant a tree!</h2>
                <p>Embrace the power of positive change! With just 5 Chiliz tokens, you can make a lasting impact on the environment. Plant a tree today and contribute to a greener, healthier future. Every small action adds up, and your investment in nature will echo for generations to come. </p>

              </div>
              <div className="image-column">
                <img src={Nouns} alt="Nounifytree"  />
              </div>
            </div>


                <div className="donation-container">
                  <div className="donation-content">
                {/* <Button variant="contained" onClick={() => handleWithdraw()} className="withdraw-button">
                   Withdraw   
                  </Button> */}
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
                      PLANT TREE
                    </Button>
                    <div className="trees-planted-text">
                      PLANTED TREEs: {treeCount}
                      <br />
                      TOTAL TREEs: {totalTrees}
                    </div>

                  </div>
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
                    // signal='time'
                    signal={currTime}
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

import './App.global.css'
import styles from './App.module.css'
import { Navigation } from './components/Navigation'
import { MetaMaskContextProvider } from './hooks/useMetaMask'
import { Routes, Route } from "react-router-dom"
import Test from './pages/Test/Test'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import Main from './pages/Main/Main'
import Barcelona from './pages/Barcelona/Barcelona'

// 1. Get projectId
const projectId = import.meta.env.VITE_PROJECT_ID

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const chzTestNet = {
  chainId: 88882,
  name: 'Chiliz Spicy Testnet',
  currency: 'CHZ',
  explorerUrl: 'https://spicy-explorer.chiliz.com/',
  rpcUrl: 'https://spicy-rpc.chiliz.com/'
}

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet, chzTestNet],
  projectId
})

export const App = () => {

  return (
    <MetaMaskContextProvider>
      <div className={styles.appContainer}>
        <div className='fixwidth'>
          <Navigation />
          <Routes>
            <Route path='/test' element={<Test />} />
            <Route path='/' element={<Main />} />
            <Route path='/Fantoken_testbar' element={<Barcelona />} />
          </Routes>
        </div>
      </div>
    </MetaMaskContextProvider>
  )
}
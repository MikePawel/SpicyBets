import { useMetaMask } from '~/hooks/useMetaMask'
import { formatAddress } from '~/utils'
import styles from './Navigation.module.css'
import { useWeb3Modal } from '@web3modal/ethers5/react'

export const Navigation = () => {
  const { open } = useWeb3Modal()

  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask()

  return (
    <div className={styles.navigation}>
      <div className={styles.flexContainer}>
        <div className={styles.leftNav}>Spicy Bets</div>
        <div className={styles.rightNav}>
          <w3m-button />
        </div>
      </div>
    </div>
  )
}
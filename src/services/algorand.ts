import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { WalletConnect } from '@walletconnect/client';
import { formatJsonRpcRequest } from '@walletconnect/utils';

// Algorand network configuration
const ALGORAND_NETWORK = 'testnet'; // Change to 'mainnet' for production
const ALGOD_TOKEN = '';
const ALGOD_SERVER = ALGORAND_NETWORK === 'mainnet' 
  ? 'https://mainnet-api.algonode.cloud'
  : 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = 443;

const INDEXER_TOKEN = '';
const INDEXER_SERVER = ALGORAND_NETWORK === 'mainnet'
  ? 'https://mainnet-idx.algonode.cloud'
  : 'https://testnet-idx.algonode.cloud';
const INDEXER_PORT = 443;

// Initialize Algorand clients
export const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);
export const indexerClient = new algosdk.Indexer(INDEXER_TOKEN, INDEXER_SERVER, INDEXER_PORT);

// Wallet connectors
export const peraWallet = new PeraWalletConnect({
  chainId: ALGORAND_NETWORK === 'mainnet' ? 416001 : 416002,
});

export const myAlgoWallet = new MyAlgoConnect();

// WalletConnect instance
let walletConnectInstance: WalletConnect | null = null;

// Web3 wallet detection
const detectWeb3Wallets = () => {
  const wallets = {
    metamask: !!(window as any).ethereum?.isMetaMask,
    coinbase: !!(window as any).ethereum?.isCoinbaseWallet,
    rainbow: !!(window as any).ethereum?.isRainbow,
    trust: !!(window as any).ethereum?.isTrust,
    phantom: !!(window as any).solana?.isPhantom
  };
  return wallets;
};

// Initialize WalletConnect
const initWalletConnect = () => {
  if (!walletConnectInstance) {
    walletConnectInstance = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: {
        open: (uri: string, cb: any) => {
          console.log('WalletConnect URI:', uri);
          // You can implement a custom QR code modal here
          cb();
        },
        close: () => {
          console.log('WalletConnect modal closed');
        }
      }
    });
  }
  return walletConnectInstance;
};

// Wallet types
export enum WalletType {
  PERA = 'pera',
  MYALGO = 'myalgo',
  DEFLY = 'defly',
  EXODUS = 'exodus',
  RAINBOW = 'rainbow',
  COINBASE = 'coinbase',
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect',
  TRUST = 'trust',
  PHANTOM = 'phantom',
  LEDGER = 'ledger'
}

export interface AlgorandAccount {
  address: string;
  name?: string;
}

export interface AlgorandTransaction {
  txId: string;
  amount: number;
  sender: string;
  receiver: string;
  note?: string;
  fee: number;
  round: number;
  timestamp: number;
}

// Wallet connection functions
export const connectWallet = async (walletType: WalletType): Promise<AlgorandAccount[]> => {
  try {
    switch (walletType) {
      case WalletType.PERA:
        const peraAccounts = await peraWallet.connect();
        return peraAccounts.map(address => ({ address }));
      
      case WalletType.MYALGO:
        const myAlgoAccounts = await myAlgoWallet.connect();
        return myAlgoAccounts.map(account => ({
          address: account.address,
          name: account.name
        }));
      
      case WalletType.WALLETCONNECT:
        const connector = initWalletConnect();
        if (!connector.connected) {
          await connector.createSession();
        }
        
        return new Promise((resolve, reject) => {
          connector.on('connect', (error, payload) => {
            if (error) {
              reject(error);
              return;
            }
            
            const { accounts } = payload.params[0];
            resolve(accounts.map((address: string) => ({ address })));
          });
        });
      
      case WalletType.METAMASK:
        if (!(window as any).ethereum?.isMetaMask) {
          throw new Error('MetaMask not detected. Please install MetaMask extension.');
        }
        
        const metamaskAccounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        // Convert Ethereum addresses to Algorand format (this is a simplified example)
        return metamaskAccounts.map((address: string) => ({
          address: address, // In production, you'd convert this to Algorand format
          name: 'MetaMask Account'
        }));
      
      case WalletType.COINBASE:
        if (!(window as any).ethereum?.isCoinbaseWallet) {
          throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet extension.');
        }
        
        const coinbaseAccounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        return coinbaseAccounts.map((address: string) => ({
          address: address,
          name: 'Coinbase Wallet'
        }));
      
      case WalletType.RAINBOW:
        if (!(window as any).ethereum?.isRainbow) {
          throw new Error('Rainbow Wallet not detected. Please install Rainbow Wallet extension.');
        }
        
        const rainbowAccounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        return rainbowAccounts.map((address: string) => ({
          address: address,
          name: 'Rainbow Wallet'
        }));
      
      case WalletType.TRUST:
        if (!(window as any).ethereum?.isTrust) {
          throw new Error('Trust Wallet not detected. Please install Trust Wallet extension.');
        }
        
        const trustAccounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        return trustAccounts.map((address: string) => ({
          address: address,
          name: 'Trust Wallet'
        }));
      
      case WalletType.PHANTOM:
        if (!(window as any).solana?.isPhantom) {
          throw new Error('Phantom Wallet not detected. Please install Phantom Wallet extension.');
        }
        
        const phantomResponse = await (window as any).solana.connect();
        return [{
          address: phantomResponse.publicKey.toString(),
          name: 'Phantom Wallet'
        }];
      
      default:
        throw new Error(`Wallet type ${walletType} not supported`);
    }
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

export const disconnectWallet = async (walletType: WalletType): Promise<void> => {
  try {
    switch (walletType) {
      case WalletType.PERA:
        await peraWallet.disconnect();
        break;
      
      case WalletType.MYALGO:
        // MyAlgo doesn't have a disconnect method
        break;
      
      case WalletType.WALLETCONNECT:
        if (walletConnectInstance && walletConnectInstance.connected) {
          await walletConnectInstance.killSession();
        }
        break;
      
      case WalletType.METAMASK:
      case WalletType.COINBASE:
      case WalletType.RAINBOW:
      case WalletType.TRUST:
        // These wallets don't require explicit disconnection
        break;
      
      case WalletType.PHANTOM:
        if ((window as any).solana?.isPhantom) {
          await (window as any).solana.disconnect();
        }
        break;
      
      default:
        break;
    }
  } catch (error) {
    console.error('Wallet disconnection error:', error);
    throw error;
  }
};

// Account information
export const getAccountInfo = async (address: string) => {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return {
      address: accountInfo.address,
      balance: accountInfo.amount / 1000000, // Convert microAlgos to Algos
      minBalance: accountInfo['min-balance'] / 1000000,
      assets: accountInfo.assets || [],
      createdAssets: accountInfo['created-assets'] || [],
      appsLocalState: accountInfo['apps-local-state'] || [],
      appsCreated: accountInfo['created-apps'] || []
    };
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
};

// Asset information
export const getAssetInfo = async (assetId: number) => {
  try {
    const assetInfo = await algodClient.getAssetByID(assetId).do();
    return {
      index: assetInfo.index,
      params: {
        name: assetInfo.params.name,
        unitName: assetInfo.params['unit-name'],
        total: assetInfo.params.total,
        decimals: assetInfo.params.decimals,
        creator: assetInfo.params.creator,
        manager: assetInfo.params.manager,
        reserve: assetInfo.params.reserve,
        freeze: assetInfo.params.freeze,
        clawback: assetInfo.params.clawback,
        url: assetInfo.params.url,
        metadataHash: assetInfo.params['metadata-hash']
      }
    };
  } catch (error) {
    console.error('Error fetching asset info:', error);
    throw error;
  }
};

// Transaction functions
export const sendAlgoTransaction = async (
  sender: string,
  receiver: string,
  amount: number,
  note: string = '',
  walletType: WalletType
): Promise<string> => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: receiver,
      amount: Math.round(amount * 1000000), // Convert Algos to microAlgos
      note: note ? new Uint8Array(Buffer.from(note)) : undefined,
      suggestedParams
    });

    let signedTxn;
    
    switch (walletType) {
      case WalletType.PERA:
        const peraSignedTxn = await peraWallet.signTransaction([txn]);
        signedTxn = peraSignedTxn[0];
        break;
      
      case WalletType.MYALGO:
        const myAlgoSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
        signedTxn = myAlgoSignedTxn.blob;
        break;
      
      case WalletType.WALLETCONNECT:
        if (!walletConnectInstance || !walletConnectInstance.connected) {
          throw new Error('WalletConnect not connected');
        }
        
        const request = formatJsonRpcRequest('algo_signTxn', [
          {
            txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64')
          }
        ]);
        
        const result = await walletConnectInstance.sendCustomRequest(request);
        signedTxn = new Uint8Array(Buffer.from(result[0], 'base64'));
        break;
      
      case WalletType.METAMASK:
      case WalletType.COINBASE:
      case WalletType.RAINBOW:
      case WalletType.TRUST:
        // For Web3 wallets, we need to use a bridge service to convert to Algorand
        // This is a simplified implementation - in production, you'd use a proper bridge
        const web3SignedTxn = await signWithWeb3Wallet(txn, walletType);
        signedTxn = web3SignedTxn;
        break;
      
      default:
        throw new Error(`Wallet type ${walletType} not supported for signing`);
    }

    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    // Wait for confirmation
    await waitForConfirmation(txId);
    
    return txId;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

// Web3 wallet signing bridge (simplified implementation)
const signWithWeb3Wallet = async (txn: any, walletType: WalletType): Promise<Uint8Array> => {
  // This is a simplified bridge implementation
  // In production, you would use a proper Web3-to-Algorand bridge service
  
  const txnBytes = algosdk.encodeUnsignedTransaction(txn);
  const txnB64 = Buffer.from(txnBytes).toString('base64');
  
  let ethereum;
  switch (walletType) {
    case WalletType.METAMASK:
      ethereum = (window as any).ethereum;
      break;
    case WalletType.COINBASE:
      ethereum = (window as any).ethereum;
      break;
    case WalletType.RAINBOW:
      ethereum = (window as any).ethereum;
      break;
    case WalletType.TRUST:
      ethereum = (window as any).ethereum;
      break;
    default:
      throw new Error('Unsupported Web3 wallet');
  }
  
  // Sign the transaction hash with the Web3 wallet
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [txnB64, accounts[0]]
  });
  
  // Convert Web3 signature to Algorand format (simplified)
  // In production, this would involve proper cryptographic conversion
  return new Uint8Array(Buffer.from(signature.slice(2), 'hex'));
};

export const sendAssetTransaction = async (
  sender: string,
  receiver: string,
  assetId: number,
  amount: number,
  note: string = '',
  walletType: WalletType
): Promise<string> => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      to: receiver,
      assetIndex: assetId,
      amount: amount,
      note: note ? new Uint8Array(Buffer.from(note)) : undefined,
      suggestedParams
    });

    let signedTxn;
    
    switch (walletType) {
      case WalletType.PERA:
        const peraSignedTxn = await peraWallet.signTransaction([txn]);
        signedTxn = peraSignedTxn[0];
        break;
      
      case WalletType.MYALGO:
        const myAlgoSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
        signedTxn = myAlgoSignedTxn.blob;
        break;
      
      default:
        throw new Error(`Wallet type ${walletType} not supported for signing`);
    }

    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    // Wait for confirmation
    await waitForConfirmation(txId);
    
    return txId;
  } catch (error) {
    console.error('Error sending asset transaction:', error);
    throw error;
  }
};

// Utility function to wait for transaction confirmation
export const waitForConfirmation = async (txId: string): Promise<any> => {
  const timeout = 10; // 10 rounds
  const status = await algodClient.status().do();
  let lastRound = status['last-round'];
  
  while (true) {
    const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
    
    if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
      return pendingInfo;
    }
    
    if (pendingInfo['pool-error'] != null && pendingInfo['pool-error'].length > 0) {
      throw new Error(`Transaction rejected: ${pendingInfo['pool-error']}`);
    }
    
    lastRound++;
    await algodClient.statusAfterBlock(lastRound).do();
    
    if (lastRound >= status['last-round'] + timeout) {
      throw new Error('Transaction confirmation timeout');
    }
  }
};

// Get transaction history
export const getTransactionHistory = async (address: string, limit: number = 50): Promise<AlgorandTransaction[]> => {
  try {
    const response = await indexerClient
      .lookupAccountTransactions(address)
      .limit(limit)
      .do();
    
    return response.transactions.map((txn: any) => ({
      txId: txn.id,
      amount: txn['payment-transaction'] 
        ? txn['payment-transaction'].amount / 1000000 
        : txn['asset-transfer-transaction']?.amount || 0,
      sender: txn.sender,
      receiver: txn['payment-transaction']?.receiver || 
               txn['asset-transfer-transaction']?.receiver || '',
      note: txn.note ? Buffer.from(txn.note, 'base64').toString() : '',
      fee: txn.fee / 1000000,
      round: txn['confirmed-round'],
      timestamp: txn['round-time']
    }));
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

// Asset opt-in
export const optInToAsset = async (
  address: string,
  assetId: number,
  walletType: WalletType
): Promise<string> => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: address,
      assetIndex: assetId,
      amount: 0,
      suggestedParams
    });

    let signedTxn;
    
    switch (walletType) {
      case WalletType.PERA:
        const peraSignedTxn = await peraWallet.signTransaction([txn]);
        signedTxn = peraSignedTxn[0];
        break;
      
      case WalletType.MYALGO:
        const myAlgoSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
        signedTxn = myAlgoSignedTxn.blob;
        break;
      
      default:
        throw new Error(`Wallet type ${walletType} not supported for signing`);
    }

    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    // Wait for confirmation
    await waitForConfirmation(txId);
    
    return txId;
  } catch (error) {
    console.error('Error opting in to asset:', error);
    throw error;
  }
};

// Common Algorand Standard Assets (ASAs)
export const COMMON_ASSETS = {
  USDC: ALGORAND_NETWORK === 'mainnet' ? 31566704 : 10458941, // USDC asset ID
  USDT: ALGORAND_NETWORK === 'mainnet' ? 312769 : 21582668,   // USDT asset ID
  ALGO: 0 // Native ALGO
};

// Price fetching (mock implementation - replace with real price API)
export const getAssetPrice = async (assetId: number): Promise<number> => {
  // Mock prices - replace with real price feed
  const mockPrices: { [key: number]: number } = {
    0: 0.18, // ALGO
    [COMMON_ASSETS.USDC]: 1.00, // USDC
    [COMMON_ASSETS.USDT]: 1.00, // USDT
  };
  
  return mockPrices[assetId] || 0;
};

// Convert between assets (swap functionality)
export const swapAssets = async (
  address: string,
  fromAssetId: number,
  toAssetId: number,
  amount: number,
  walletType: WalletType
): Promise<string> => {
  // This is a simplified swap - in production, you'd integrate with a DEX like Tinyman
  try {
    // For demo purposes, we'll just do a simple asset transfer
    // In reality, this would involve multiple transactions through a DEX
    
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    // Create swap transaction (simplified)
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: address, // In real swap, this would be the DEX contract
      assetIndex: fromAssetId,
      amount: amount,
      note: new Uint8Array(Buffer.from(`Swap ${fromAssetId} to ${toAssetId}`)),
      suggestedParams
    });

    let signedTxn;
    
    switch (walletType) {
      case WalletType.PERA:
        const peraSignedTxn = await peraWallet.signTransaction([txn]);
        signedTxn = peraSignedTxn[0];
        break;
      
      case WalletType.MYALGO:
        const myAlgoSignedTxn = await myAlgoWallet.signTransaction(txn.toByte());
        signedTxn = myAlgoSignedTxn.blob;
        break;
      
      default:
        throw new Error(`Wallet type ${walletType} not supported for signing`);
    }

    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    // Wait for confirmation
    await waitForConfirmation(txId);
    
    return txId;
  } catch (error) {
    console.error('Error swapping assets:', error);
    throw error;
  }
};

// Export wallet detection utility
export { detectWeb3Wallets };
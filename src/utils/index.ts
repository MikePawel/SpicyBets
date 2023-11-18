export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
  return balance
}

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex)
  return chainIdNum
}

export const formatAddress = (addr: string) => {
  return `${addr.substring(0, 4)}...${addr.substring(38, 42)}`
}


const fetchData = async (url: string, fanToken: string) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const responseData = await response.json();

      // Goes through the whole array requested by the API and searches for the exact token needed for the validity check
      // if you have 1 or more fan tokens you can enter
      let tokenBalance = 0
      for (let i = 0; i < responseData.result.length; i++) {
        if (responseData.result[i].symbol == fanToken) {
          tokenBalance = responseData.result[i].balance
        }
      }
      return tokenBalance
    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const checkFanTokenAmount = (fanToken: string, addr: string) => {

  const tokenListUrl = `https://spicy-explorer.chiliz.com/api?module=account&action=tokenlist&address=${addr}`;
  return fetchData(tokenListUrl, fanToken);

}

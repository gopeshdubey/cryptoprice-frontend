import axios from "axios";

const getCryptoData = async() => {
    const response = await axios.get(process.env.REACT_APP_API_URL);
    return { cryptoList: response?.data?.data || [], currencyList: response?.data && response?.data?.data.length > 0 && response?.data?.data[0]?.currencies || [] }
}

const getCryptoPrice = async(sourceCrypto, amount, targetCurrency) => {
    const response = await axios.post(process.env.REACT_APP_API_URL, {sourceCrypto, amount, targetCurrency})
    return { price: response?.data.data?.price }
}

export default { getCryptoData, getCryptoPrice }
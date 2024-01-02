import React, { useEffect, useState } from 'react';
import styles from './SwapCard.module.css';
import Spinner from './Spinner';
import Button from './Button';
import axios from 'axios';

const SwapCard = () => {
  const [validate, setValidate] = useState("");
  const [amount, setAmount] = useState(0);
  const [quote, setQuote] = useState();
  const [crypto, setCrypto] = useState();
  const [currency, setCurrency] = useState('usd');
  const [cryptoList, setCryptoList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL);
      if (response.data && response.data.data && response.data.data.length) {
        setCryptoList(response.data.data);
        setCurrencyList(response.data.data[0].currencies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validation = () => {
    if (!crypto) {
      setValidate("Select crypto")
      return false
    }
    if (amount == 0) {
      setValidate("Enter amount")
      return false
    }
    return true
  }

  const onClickSwapButton = async (event) => {
    setIsLoading(true);
    event.preventDefault()

    const value = validation()
    if (value) {
      const body = {
        sourceCrypto: crypto,
        amount: amount,
        targetCurrency: currency,
      };
      const response = await axios.post(process.env.REACT_APP_API_URL, body);
      if (response.data && response.data.data) {
        setQuote(response.data.data.price);
        setValidate("")
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  return (
    <>
      <div className={styles.swapCard}>
        <div>
          <div className={styles.formGroup}>
            <input
              className={styles.formControl}
              type="text"
              placeholder="Amount in"
              onChange={(event) => setAmount(parseFloat(event.target.value))}
            />
            <div className={styles.tokenContainer}>
                <select
                  onChange={(e) => setCrypto(e.target.value)}
                >
                  <option value={"select crypto"}>{"select crypto"}</option>
                  {cryptoList.length > 0 &&
                    cryptoList.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                </select>
            </div>
          </div>
          <p className={styles.validation}>{validate}</p>
        </div>
        <div>
          <div className={styles.formGroup}>
            <div className={styles.currencyContainer}>
              {
                currency && <select
                  onChange={(e) => setCurrency(e.target.value)}
                  defaultValue={currency}
                >
                  {currencyList.length > 0 &&
                    currencyList.map((data, index) => (
                      <option
                        key={index}
                        value={data}
                        selected={data == currency ? true : false}
                      >
                        {data}
                      </option>
                    ))}
                </select>
              }
            </div>
          </div>
          {quote && <p className={styles.balance}>PRICE: {quote}</p>}
        </div>
        <Button onClick={(e) => onClickSwapButton(e)}>
          Price
        </Button>
      </div>
      {isLoading && <Spinner />}
    </>
  );
};

export default SwapCard;

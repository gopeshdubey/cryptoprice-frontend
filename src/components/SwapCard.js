import React, { useEffect, useState } from 'react';
import styles from './SwapCard.module.css';
import Spinner from './Spinner';
import Button from './Button';
import axios from 'axios';
import apiList from "../adapter/api";

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
      const response = await apiList.getCryptoData();
      setCryptoList(response.cryptoList);
      setCurrencyList(response.currencyList);
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
      try {
        const response = await apiList.getCryptoPrice(crypto,amount,currency);
        if (response.price) {
          setQuote(response.price);
          setValidate("")
        }
      } catch (error) {
        alert("Something went wrong")
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

import PayinTransaction from "../model/PayinTransaction.js";
import PayoutTransaction from "../model/PayoutTransaction.js";
import User from "../model/User.js";
import getCountryISO3 from "country-iso-2-to-3";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import ShortUniqueId from 'short-unique-id';
import querystring from 'querystring';
import crypto, { sign } from 'crypto';
import TelegramBot from 'node-telegram-bot-api';
import ForwardedSms from "../model/ForwardedSms.js";
import AgentNumber from "../model/AgentNumber.js";
import ApiAccountBkash from "../model/ApiAccountBkash.js";
import { fetchPayinTransactions } from "./client_controller.js";
import cron from 'node-cron';
import merchant_model from "../model/Merchnatmodel.js";
import Agent_model from "../model/Agentregistration.js";

const SERVER_URL = 'https://eassypay.com/api';
const BASE_URL = 'http://localhost:3000';

function generate256Hash(data) {
  // Use SHA256 to generate a hash
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// const BKASH_URL = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout'; 
let BKASH_URL = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout';
// const BKASH_USERNAME = '01894292898'; 
let BKASH_USERNAME = '01711799891';
// const BKASH_PASSWORD = 'VOqd7H]5j[!'; 
let BKASH_PASSWORD = 'b8t|m:1I|oF';
// const BKASH_APP_KEY = '2aTnOgA6sdaZ5hz9SfPK4Aajtc'; 
let BKASH_APP_KEY = 'bMk6yA8dUSi1RjEKjURQablGtc';
// const BKASH_APP_SECRET_KEY = 'vHqUepso0iRbToaEe4O1Vwl0b2tBDnPylSDX2hSq8g1hNd05V2Gr'; 
let BKASH_APP_SECRET_KEY = 'qbl6yK033pPGUeKyJFs2oppUPPeNyJHZn62oOOkMaU3qA0GecnEC';

const get_token_bkash = async () => {
  try {
    const body = {
      app_key: BKASH_APP_KEY, 
      app_secret: BKASH_APP_SECRET_KEY
    };

    const tokenObj = await axios.post(`${BKASH_URL}/token/grant`, body, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        username: BKASH_USERNAME,
        password: BKASH_PASSWORD
      }
    });
    // console.log('bkash-get-token-resp', tokenObj.data);
    return tokenObj.data.id_token;

  } catch (error) {

    console.log('bkash-get-token-error', error);

    return null;
  }  
}

// ----------------------------bkash pament----------------------
export const payment_bkash = async (req, res) => {
  const apiKey = req.headers['x-api-key']?req.headers['x-api-key']:'';
  const data = req.body;
  console.log('bkash-payment-data', req.body.payerId);
  
  if (!data.mid || !data.orderId || !data.payerId || !data.amount || !data.currency || !data.redirectUrl || !data.callbackUrl) {
    return res.status(200).json({
      success: false,
      orderId: data.orderId,
      message: "Required fields are not filled out."
    })
  }
  
  console.log("pass-condition-1")
  
  if (data.currency === "USD" && parseFloat(data.amount) < 10) {
    return res.status(200).json({
      success: false,
      orderId: data.orderId,
      message: "Minimum deposit amount should be at least 10 for USD currency."
    })
  }
  
  try {
    const merchant = await User.findOne({name: data.mid, status: 'activated'});
    
    if (!merchant) {
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "There is not existing activated merchant with API key"
      })
    }
    
    const payinTransaction = await PayinTransaction.findOne({
      orderId: data.orderId,
      merchant: data.mid
    });
    
    if (payinTransaction) {
      console.log('same order id for payment', data.orderId, payinTransaction.status);
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Transaction with duplicated order id, " + data.orderId + "."
      });  
    }
    
    // Find eligible API accounts with sufficient balance and limit
    const eligibleAccounts = await Agent_model.find({
      merchant_name: data.mid,
      api_account: true,
      balance_in_bdt: { $gte: data.amount },
    });
    
    console.log("Eligible API accounts:", eligibleAccounts);
    
    if (!eligibleAccounts || eligibleAccounts.length === 0) {
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "No available API accounts with sufficient balance and limit for this transaction."
      });
    }
    
    // Randomly select one from eligible accounts
    const randomIndex = Math.floor(Math.random() * eligibleAccounts.length);
    const selectedAccount = eligibleAccounts[randomIndex];
    console.log("Selected API account:", selectedAccount);
    
    // Update BKASH credentials based on selected account
    if (data.mid !== 'merchant1' && selectedAccount) {
      BKASH_URL = 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout';
      BKASH_USERNAME = selectedAccount.username;
      BKASH_PASSWORD = selectedAccount.password;
      BKASH_APP_KEY = selectedAccount.appKey;
      BKASH_APP_SECRET_KEY = selectedAccount.appSecretKey;
    }

    const token = await get_token_bkash();
    if (!token) {
      console.log('bkash-token-is-null');
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Internal Error"
      }); 
    }
    
    const referenceId = nanoid(16);
    const body = {
      mode: '0011', 
      payerReference: data.payerId,
      callbackURL: data.callbackUrl,
      amount: data.amount,
      currency: data.currency,
      intent: 'sale',
      merchantInvoiceNumber: referenceId,
    };

    const createObj = await axios.post(`${BKASH_URL}/create`, body, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'x-app-key': BKASH_APP_KEY,
        Authorization: token
      }
    });

    console.log('bkash-payment-create-resp', createObj.data);
    
    const create_user_pament = new merchant_model({
      merchant_name: data.mid,
      player_id: data.payerId,
      website_url: data.redirectUrl
    });
    
    if(create_user_pament) {
      create_user_pament.save();
    }
    
    if (createObj.data.statusCode && createObj.data.statusCode === '0000') {
      const newTransaction = await PayinTransaction.create({
        paymentId: createObj.data.paymentID,
        merchant: data.mid,
        agentAccount: selectedAccount.accountNumber,
        provider: 'bkash',
        orderId: data.orderId,
        payerId: data.payerId,
        expectedAmount: data.amount,
        currency: data.currency,
        redirectUrl: data.redirectUrl,
        callbackUrl: data.callbackUrl,
        referenceId,
        submitDate: new Date(),
        paymentType: 'p2c'
      }); 

      return res.status(200).json({
        success: true,
        message: "Payment link created.",
        orderId: data.orderId,
        paymentId: createObj.data.paymentID,
        link: createObj.data.bkashURL
      })
    } else {
      console.log('bkash-payment-create-fail', createObj.data.errorCode, createObj.data.errorMessage);
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Internal Error"
      }); 
    }

  } catch (e) {
    console.log('bkash-payment-error', e.message);
    res.status(500).json({ 
      success: false,
      orderId: data.orderId,
      message: e.message 
    });
  }
};

export const callback_bkash = async (req, res) => {
  const data = req.body;
  console.log('bkash-callback-data', data);
  try {
    const transaction = await PayinTransaction.findOne({
			paymentId: data.paymentID
		});
		if (!transaction) {
      console.log('bkash-callback-no-transaction-with-paymentID', data.paymentID);
			return res.status(200).json({
        success: false,
        message: "There is no transaction with provided payment ID, " + data.paymentID + "."
      });  
		}

    res.status(200).json({
      success: true,
      // orderId: transaction.orderId,
      redirectUrl: transaction.redirectUrl
    }); 

    if (data.status !== 'success') return;

    if (transaction.status !== 'pending') {
      console.log('bkash-callback-transaction-already-done');
      return; 
    }

    const token = await get_token_bkash();
    if (!token) {
      console.log('bkash-token-is-null');
      return; 
    }
    
    const body = {
      paymentID: data.paymentID,
    };

    const executeObj = await axios.post(`${BKASH_URL}/execute`, body, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'x-app-key': BKASH_APP_KEY,
        Authorization: token
      }
    });

    console.log('bkash-payment-execute-resp', executeObj.data); // return;

    if (executeObj.data.statusCode && executeObj.data.statusCode === '0000') {

      if (executeObj.data.transactionStatus === 'Initiated') {
        return fetch_bkash(data.paymentID);
      } else {
        let transaction_status = 'processing';

        if (executeObj.data.transactionStatus === 'Completed') {
          transaction_status = 'fully paid';
          const find_agent=await Agent_model.findOne({accountNumber:transaction.agentAccount});
          const main_agent=await Agent_model.findById({_id:createdby_id});
          const agent_commission = (transaction.expectedAmount / 100) * find_agent.commission_rate;
      find_agent.balance_in_bdt -= parseFloat(transaction.expectedAmount);
      find_agent.commission += agent_commission;
      main_agent.balance_in_bdt-=parseFloat(transaction.expectedAmount);
      main_agent.remain_balance-=parseFloat(transaction.expectedAmount);
      main_agent.deposits.push(newDeposit);

      main_agent.commission+= agent_commission;
      await main_agent.save();
      await agent.save();
        } else if (executeObj.data.transactionStatus === 'Pending Authorized') {
          transaction_status = 'hold';
        } else if (executeObj.data.transactionStatus === 'Expired') {
          transaction_status = 'expired';
        } else if (executeObj.data.transactionStatus === 'Declined') {
          transaction_status = 'suspended';
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = executeObj.data.trxID;
        transaction.receivedAmount = executeObj.data.amount;
        transaction.payerAccount = executeObj.data.customerMsisdn;
        await transaction.save();
        
        if (transaction.callbackUrl && (transaction.status === 'fully paid' || transaction.status === 'expired' || transaction.status === 'suspended')) {
          
          const merchant = await User.findOne({name: transaction.merchant, role: 'merchant'});
          if (!merchant) throw Error('Merchant to callback does not exist');

          const hash = generate256Hash(transaction.paymentId + transaction.orderId + transaction.receivedAmount.toString() + transaction.currency + merchant.apiKey);

          let payload = {
            paymentId: transaction.paymentId,
            orderId: transaction.orderId,
            amount: transaction.receivedAmount,
            currency: transaction.currency,
            transactionId: transaction.transactionId,
            status: transaction.status,
            hash,
          };

          await axios
          .post(
            transaction.callbackUrl,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          )
          .then(async (resp) => {
            console.log('bkash-payment-execute-callback-to-mechant-resp', resp.data, resp.status);
            if (resp.status == 200) {
              transaction.sentCallbackDate = new Date();
              await transaction.save();
            }
            console.log('Callback has been sent to the merchant successfully'); 
          })
          .catch((e) => {
            console.log('bkash-payment-execute-callback-to-mechant-resp-error', e.message);
            console.log('Callback to the merchant failed');   
          });
        }
      }

    } else if (executeObj.data.statusCode) {
      console.log('bkash-payment-execute-others', executeObj.data.statusCode, executeObj.data.statusMessage); 
      return;
    } else if (executeObj.data.errorCode) {
      console.log('bkash-payment-execute-fail', executeObj.data.errorCode, executeObj.data.errorMessage);      
      
      if (transaction.status !== 'pending') {
        console.log('bkash-callback-transaction-already-done');
        return; 
      }

      const currentTime = new Date();
      transaction.status = 'suspended';
      transaction.statusDate = currentTime;
      await transaction.save();
      
      if (transaction.callbackUrl) {
        
        const merchant = await User.findOne({name: transaction.merchant, role: 'merchant'});
        if (!merchant) throw Error('Merchant to callback does not exist');

        const hash = generate256Hash(transaction.paymentId + transaction.orderId + '0' + transaction.currency + merchant.apiKey);

        let payload = {
          paymentId: transaction.paymentId,
          orderId: transaction.orderId,
          amount: 0,
          currency: transaction.currency,
          transactionId: null,
          status: transaction.status,
          hash,
        };

        await axios
        .post(
          transaction.callbackUrl,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        )
        .then(async (resp) => {
          console.log('bkash-payment-execute-callback-to-mechant-resp', resp.data);
          if (resp.data.success) {
            transaction.sentCallbackDate = new Date();
            await transaction.save();
          }
          console.log('Callback has been sent to the merchant successfully'); 
        })
        .catch((e) => {
          console.log('bkash-payment-execute-callback-to-mechant-resp-error', e.message);
          console.log('Callback to the merchant failed');   
        });
      }
    }

  } catch (e) {

    console.log('bkash-callback-error', e.message);

  }
};

const fetch_bkash = async (paymentID) => {
  
  console.log('bkash-fetch-data', paymentID);
  sleep(1000);

  try {
    
    const transaction = await PayinTransaction.findOne({
			paymentId: paymentID
		});
		if (!transaction) {
      console.log('bkash-fetch-no-transaction-with-paymentID', paymentID);
			return;  
		}

    const token = await get_token_bkash();
    if (!token) {
      console.log('bkash-token-is-null');
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Internal Error"
      }); 
    }
    
    const body = {
      paymentID
    };

    const queryObj = await axios.post(`${BKASH_URL}/payment/status`, body, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'x-app-key': BKASH_APP_KEY,
        Authorization: token
      }
    });

    console.log('bkash-payment-query-resp', queryObj.data); // return;

    if (queryObj.data.statusCode && queryObj.data.statusCode === '0000') {
      
      if (queryObj.data.transactionStatus === 'Initiated') {
        fetch_bkash(paymentID);
      } else {
        let transaction_status = 'processing';

        if (queryObj.data.transactionStatus === 'Completed') {
          transaction_status = 'fully paid';
        } else if (queryObj.data.transactionStatus === 'Pending Authorized') {
          transaction_status = 'hold';
        } else if (queryObj.data.transactionStatus === 'Expired') {
          transaction_status = 'expired';
        } else if (queryObj.data.transactionStatus === 'Declined') {
          transaction_status = 'suspended';
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = queryObj.data.trxID;
        transaction.receivedAmount = queryObj.data.amount;
        transaction.payerAccount = queryObj.data.customerMsisdn;
        await transaction.save();
        
        if (transaction.callbackUrl && (transaction.status === 'fully paid' || transaction.status === 'expired' || transaction.status === 'suspended') && !transaction.sentCallbackDate) {
          
          const merchant = await User.findOne({name: transaction.merchant, role: 'merchant'});
          if (!merchant) throw Error('Merchant to callback does not exist');

          const hash = generate256Hash(transaction.paymentId + transaction.orderId + transaction.receivedAmount.toString() + transaction.currency + merchant.apiKey);

          let payload = {
            paymentId: transaction.paymentId,
            orderId: transaction.orderId,
            amount: transaction.receivedAmount,
            currency: transaction.currency,
            transactionId: transaction.transactionId,
            status: transaction.status,
            hash,
          };

          await axios
          .post(
            transaction.callbackUrl,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            }
          )
          .then(async (resp) => {
            console.log('bkash-fetch-callback-to-mechant-resp', resp.data);
            if (resp.data.success) {
              transaction.sentCallbackDate = new Date();
              await transaction.save();
            }
            console.log('Callback has been sent to the merchant successfully'); 
          })
          .catch((e) => {
            console.log('bkash-fetch-callback-to-mechant-resp-error', e.message);
            console.log('Callback to the merchant failed');   
          });
        }
      }

    } else {
      console.log('bkash-payment-query-fail', queryObj.data.errorCode, queryObj.data.errorMessage);      
      const currentTime = new Date();
      transaction.status = 'suspended';
      transaction.statusDate = currentTime;
      await transaction.save();
    }

  } catch (e) {

    console.log('bkash-fetch-error', e.message);
    fetch_bkash(paymentID);

  }
};
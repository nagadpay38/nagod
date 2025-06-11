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
import { NagadGateway } from 'nagad-payment-gateway';

const SERVER_URL = 'https://eassypay.com/api';
const BASE_URL = 'https://eassypay.com';

function generate256Hash(data) {
  // Use SHA256 to generate a hash
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let NAGAD_URL = process.env.SANDBOX_NAGAD_URL;
// let NAGAD_URL = 'http://mynagad.com:10080/remote-payment-gateway-1.0';

let NAGAD_CALLBACK_URL =
  process.env.SERVER_URL + process.env.NAGAD_CALLBACK_URL;

let NAGAD_MID = process.env.SANDBOX_NAGAD_MID; // sandbox
// let NAGAD_MID = '686057456165399';

let NAGAD_MNUMBER = process.env.NAGAD_MNUMBER;
// let NAGAD_MNUMBER = "01605745616";

let NAGAD_MPRIVKEY = process.env.SANDBOX_NAGAD_MPRIVKEY;
let NAGAD_NPUBKEY = process.env.SANDBOX_NAGAD_NPUBKEY;

const config = {
  apiVersion: "v-0.2.0",
  baseURL: "http://mynagad.com:10080/remote-payment-gateway-1.0",
  callbackURL: "https://nagodpay.com/api/payment/p2c/nagad/callback",
  merchantID: "687116248255399",
  merchantNumber: "01711624825",
  privKey: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgAov6qDgsbWxDQlJoX/QHMNal2YLj0OWg+cm5e/Oe+Y4/r/fgdyIqiky9r78fvfI17GElCcleUCa4dJrmp4ueaDWNK42b2wC1KLuVeLrzody1y+5s7wKsEM8jdct/0e+kkmtLEm8Lrb7H5DxyCfrxyYXL0aeosY+TygfHlg+yHKsImSigwI3uHVClBRhPw59H5+D49Vzkq5o5mETfISdP5Z0b2pmVRdLqmAFdXRZcH6NolkuQtpSCvMC1DC2tA+IhxQyjwBwnPwssORdey54wGfdZL3xgu50YSfEVRoiEuwm1mujvHb5Bn/FB/pbWtLu9JHTvrDyJSOun/V679IwrAgMBAAECggEAYO+5M1boOBGB7/kbQB+FsjboLAzcH0melPKC4MlKu1iyvcygL3peRppiaxNKWaoQzlTkFOsPQMjeeKO9BGMsf/gIdHaMaQ10WPCvfBcqj5NTtzfwjSNAvMTpXibzUPTABy91Tp9DfoJJNKcHoTHAbjEOvQyUyONNhl6+zxeY4zHFR81ODsDx86qmTaMIp/UnzyJi86mrbZY0X/iq3s0rBfLbmzvqZ/la7kpAxZ3osHekp3KZ/df1TMOrO+wemlNDI3zYO8UVd4AqRS+etJneCi+awMbzuC6GcZdNK014mXMp2fZtQ7y4f7rfdfYIAtL7lyahU39RigzdspPwPIhgwQKBgQD474vku/hdxOVqrpUPrb/YbO196CBmRMFiLxxPHYRwU4V/+GguTE2bVaBZQDL/Y8heL93f/+bCa1We6l5VGGmIPQbdjRSOvt9UgIlA9fd1SS++VBU544JXCXpRFDUaroA0OMYiDnrn46S/tx9c0XOiXWCjke+40Gfp+Pe2EbKSlQKBgQDmXevG7Rh78cnTZqWPW6AffvUGNzVOOjjqNdbsqX4B2BIbth5iAaj4wjL0Ay3cM8U06MkpMlZ43TB3OZsxIR2D7v9cJRCkL6J+8e805meGhwkV/hUXh4e1/TYJROz/bkeDjNw4z+/HmF9KO3VzbFlzHgefcmJF925VGKgwIo+zvwKBgQDzHtEb1dEdk10UMel25JSHROs1mm16NBBCWgxl4EgmhAvQDcWB4hexa5EtWZv0/XkFM+6YBI9UtgtrJy52IV+AJUn9Ovom55eqKdbi0Nabf5zXX7tTTDVR1/nUEc5DfsXLOt+XB1lV/Gg8rRY+SnmKy3PEjJT5hODYC8Wx1dr3eQKBgQCExzG00MfB+NUJgip+/KLIRJbZ5ExXMHvJkwq0EeVNDssxKcFNYAOSjexsdMCkITrTijEYC6mHtIXQ0mU+5gVrHAAXjk2PNN2GKdBkP0EAayizgmWJ0FZKcQ4KPa4Uc+3IRxJPtJpSAuM5mBfUVWkhTve50WYPSdRQPAwE4obNZQKBgFbiAcmSUUvxuGN9IbJf6yhcIPSvTy2z+0ytEXxvSMiyOX7dlC9vN5bE3W4e/C/GAKXwVmWamxbiXXoX1Bf8J8eA+25duSXADiE5n1tfK3BoOW6LHlMMmSuL8D/UB60CnKb/FsJDDCgdJPDEgqDVLByF9rXah/Ia6F1LoA8e+Wij",
  pubKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4AKL+qg4LG1sQ0JSaF/0BzDWpdmC49DloPnJuXvznvmOP6/34HciKopMva+/H73yNexhJQnJXlAmuHSa5qeLnmg1jSuNm9sAtSi7lXi686HctcvubO8CrBDPI3XLf9HvpJJrSxJvC62+x+Q8cgn68cmFy9GnqLGPk8oHx5YPshyrCJkooMCN7h1QpQUYT8OfR+fg+PVc5KuaOZhE3yEnT+WdG9qZlUXS6pgBXV0WXB+jaJZLkLaUgrzAtQwtrQPiIcUMo8AcJz8LLDkXXsueMBn3WS98YLudGEnxFUaIhLsJtZro7x2+QZ/xQf6W1rS7vSR076w8iUjrp/1eu/SMKwIDAQAB",
  isPath: false,
};



const nagad = new NagadGateway(config);

export const payment_nagad = async (req, res) => {
  try {
    console.log('Starting payment_nagad function');
    const data = req.body;
    console.log('Request body:', JSON.stringify(data, null, 2));
    console.log('Nagad Base URL:', nagad.baseURL); 
    // API Key validation
    const apiKey = "CDA990F26E7D765621178638A292EDB84FEE2D44E4ADA8DA8939DFF76DAD64D9";
    console.log('API Key being used:', apiKey);
    
    if (!apiKey) {
      console.error('API key is missing');
      return sendErrorResponse(res, "API key is required.", data.orderId);
    }

    // Required fields validation
    console.log('Validating required fields');
    const validationError = validateRequiredFields(data);
    if (validationError) {
      console.error('Validation error:', validationError);
      return sendErrorResponse(res, validationError, data.orderId);
    }

    // Amount validation
    console.log('Validating amount');
    const amountError = validateAmount(data.amount, data.currency);
    if (amountError) {
      console.error('Amount validation error:', amountError);
      return sendErrorResponse(res, amountError, data.orderId);
    }

    // Merchant validation
    console.log('Validating merchant');
    const merchant = await User.findOne({
      name: data.mid,
      status: "activated",
    });
    console.log('Merchant found:', merchant);

    // Duplicate transaction check
    console.log('Checking for duplicate transactions');
    const paymentConfig = {
      amount: data.amount,
      ip: data.ip,
      orderId: data.orderId,
      productDetails: { order_id: data.orderId },
      clientType: "PC_WEB",
    };
    console.log('Payment config:', paymentConfig);

    const existingTransaction = await PayinTransaction.findOne({
      orderId: data.orderId,
      merchant: data.mid,
    });
    console.log('Existing transaction check result:', existingTransaction);
    
    if (existingTransaction) {
      console.error('Duplicate transaction found');
      return sendErrorResponse(
        res,
        `Transaction with duplicated order id, ${data.orderId}.`,
        data.orderId
      );
    }

    // Create Nagad payment
    const referenceId = `${Date.now()}`;
    console.log('Generated referenceId:', referenceId);

    let nagadResponse;
    console.log('Attempting to create Nagad payment');

    try {
      console.log('Calling nagad.createPayment with config:', paymentConfig);
      nagadResponse = await nagad.createPayment(paymentConfig);
      console.log('Nagad payment response:', JSON.stringify(nagadResponse, null, 2));
      console.log("nagad-payment-response", nagadResponse);
    } catch (error) {
      console.error('Error in nagad.createPayment:', error);
      console.log("Full error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        type: error.type,
        errno: error.errno
      });
      console.error("nagad-payment-creation-error:", error);
      return sendErrorResponse(
        res,
        "Failed to create Nagad payment: " + error.message,
        data.orderId
      );
    }

    if (!nagadResponse) {
      console.error("nagad-payment-creation-failed - No response received");
      return sendErrorResponse(
        res,
        `Payment creation failed: No response received from Nagad`,
        data.orderId
      );
    }

    // Create transaction record
    console.log('Creating transaction record');
    const newTransaction = await PayinTransaction.create({
      paymentId: nagadResponse.paymentId,
      merchant: data.mid,
      provider: "nagad",
      orderId: data.orderId,
      payerId: data.payerId,
      expectedAmount: data.amount,
      currency: data.currency,
      redirectUrl: data.redirectUrl,
      callbackUrl: data.callbackUrl,
      referenceId,
      submitDate: new Date(),
      paymentType: "p2c",
      status: "pending",
    });
    console.log("Transaction created successfully:", newTransaction._id);

    console.log('Returning success response');
    return res.status(200).json({
      success: true,
      message: "Payment link created.",
      orderId: data.orderId,
      paymentId: nagadResponse.paymentId,
      link: nagadResponse,
      referenceId,
    });
  } catch (error) {
    console.error("payment_nagad fatal error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      type: error.type,
      errno: error.errno
    });
    return sendErrorResponse(res, error.message, req.body?.orderId, 500);
  }
};
// Helper functions
const sendErrorResponse = (res, message, orderId, status = 200) => {
  return res.status(status).json({
    success: false,
    orderId,
    message,
  });
};

const validateRequiredFields = (data) => {
  const requiredFields = [
    "mid",
    "orderId",
    "payerId",
    "amount",
    "currency",
    "redirectUrl",
    "callbackUrl",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return "Required fields are not filled out.";
  }
  return null;
};

const validateAmount = (amount, currency) => {
  try {
    const amountFloat = parseFloat(amount);
    if ((currency === "BDT" || currency === "INR") && amountFloat < 150) {
      return `Minimum deposit amount should be at least 150 for ${currency} currency.`;
    }
    if (currency === "USD" && amountFloat < 10) {
      return "Minimum deposit amount should be at least 10 for USD currency.";
    }
    return null;
  } catch {
    throw new Error("Invalid amount format");
  }
};

export const callback_nagad = async (req, res) => {
  const data = req.body;
  console.log("nagad-callback-data", data);
  // return;

  try {
    const transaction = await PayinTransaction.findOne({
      paymentId: data.paymentID,
    });
    if (!transaction) {
      console.log(
        "bkash-callback-no-transaction-with-paymentID",
        data.paymentID
      );
      return res.status(200).json({
        success: false,
        message:
          "There is no transaction with provided payment ID, " +
          data.paymentID +
          ".",
      });
    }

    res.status(200).json({
      success: true,
      // orderId: transaction.orderId,
      redirectUrl: transaction.redirectUrl,
    });

    if (data.status !== "success") return;

    if (transaction.status !== "pending") {
      console.log("bkash-callback-transaction-already-done");
      return;
    }

    const token = await get_token_bkash();
    if (!token) {
      console.log("bkash-token-is-null");
      return;
    }

    const body = {
      paymentID: data.paymentID,
    };

    const executeObj = await axios.post(`${BKASH_URL}/execute`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-app-key": BKASH_APP_KEY,
        Authorization: token,
      },
    });

    console.log("bkash-payment-execute-resp", executeObj.data); // return;

    if (executeObj.data.statusCode && executeObj.data.statusCode === "0000") {
      if (executeObj.data.transactionStatus === "Initiated") {
        return fetch_bkash(data.paymentID);
      } else {
        let transaction_status = "processing";

        if (executeObj.data.transactionStatus === "Completed") {
          transaction_status = "fully paid";
        } else if (executeObj.data.transactionStatus === "Pending Authorized") {
          transaction_status = "hold";
        } else if (executeObj.data.transactionStatus === "Expired") {
          transaction_status = "expired";
        } else if (executeObj.data.transactionStatus === "Declined") {
          transaction_status = "suspended";
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = executeObj.data.trxID;
        transaction.receivedAmount = executeObj.data.amount;
        transaction.payerAccount = executeObj.data.customerMsisdn;
        await transaction.save();

        if (
          transaction.callbackUrl &&
          (transaction.status === "fully paid" ||
            transaction.status === "expired" ||
            transaction.status === "suspended")
        ) {
          const merchant = await User.findOne({
            name: transaction.merchant,
            role: "merchant",
          });
          if (!merchant) throw Error("Merchant to callback does not exist");

          const hash = generate256Hash(
            transaction.paymentId +
              transaction.orderId +
              transaction.receivedAmount.toString() +
              transaction.currency +
              merchant.apiKey
          );

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
            .post(transaction.callbackUrl, payload, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then(async (resp) => {
              console.log(
                "bkash-payment-execute-callback-to-mechant-resp",
                resp.data,
                resp.status
              );
              if (resp.status == 200) {
                transaction.sentCallbackDate = new Date();
                await transaction.save();
              }
              console.log(
                "Callback has been sent to the merchant successfully"
              );
            })
            .catch((e) => {
              console.log(
                "bkash-payment-execute-callback-to-mechant-resp-error",
                e.message
              );
              console.log("Callback to the merchant failed");
            });
        }
      }
    } else if (executeObj.data.statusCode) {
      console.log(
        "bkash-payment-execute-others",
        executeObj.data.statusCode,
        executeObj.data.statusMessage
      );
      return;
    } else if (executeObj.data.errorCode) {
      console.log(
        "bkash-payment-execute-fail",
        executeObj.data.errorCode,
        executeObj.data.errorMessage
      );

      if (transaction.status !== "pending") {
        console.log("bkash-callback-transaction-already-done");
        return;
      }

      const currentTime = new Date();
      transaction.status = "suspended";
      transaction.statusDate = currentTime;
      await transaction.save();

      if (transaction.callbackUrl) {
        const merchant = await User.findOne({
          name: transaction.merchant,
          role: "merchant",
        });
        if (!merchant) throw Error("Merchant to callback does not exist");

        const hash = generate256Hash(
          transaction.paymentId +
            transaction.orderId +
            "0" +
            transaction.currency +
            merchant.apiKey
        );

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
          .post(transaction.callbackUrl, payload, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then(async (resp) => {
            console.log(
              "bkash-payment-execute-callback-to-mechant-resp",
              resp.data
            );
            if (resp.data.success) {
              transaction.sentCallbackDate = new Date();
              await transaction.save();
            }
            console.log("Callback has been sent to the merchant successfully");
          })
          .catch((e) => {
            console.log(
              "bkash-payment-execute-callback-to-mechant-resp-error",
              e.message
            );
            console.log("Callback to the merchant failed");
          });
      }
    }
  } catch (e) {
    console.log("bkash-callback-error", e.message);
  }
};

const fetch_bkash = async (paymentID) => {
  console.log("bkash-fetch-data", paymentID);
  sleep(1000);

  try {
    const transaction = await PayinTransaction.findOne({
      paymentId: paymentID,
    });
    if (!transaction) {
      console.log("bkash-fetch-no-transaction-with-paymentID", paymentID);
      return;
    }

    const token = await get_token_bkash();
    if (!token) {
      console.log("bkash-token-is-null");
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Internal Error",
      });
    }

    const body = {
      paymentID,
    };

    const queryObj = await axios.post(`${BKASH_URL}/payment/status`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-app-key": BKASH_APP_KEY,
        Authorization: token,
      },
    });

    console.log("bkash-payment-query-resp", queryObj.data); // return;

    if (queryObj.data.statusCode && queryObj.data.statusCode === "0000") {
      if (queryObj.data.transactionStatus === "Initiated") {
        fetch_bkash(paymentID);
      } else {
        let transaction_status = "processing";

        if (queryObj.data.transactionStatus === "Completed") {
          transaction_status = "fully paid";
        } else if (queryObj.data.transactionStatus === "Pending Authorized") {
          transaction_status = "hold";
        } else if (queryObj.data.transactionStatus === "Expired") {
          transaction_status = "expired";
        } else if (queryObj.data.transactionStatus === "Declined") {
          transaction_status = "suspended";
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = queryObj.data.trxID;
        transaction.receivedAmount = queryObj.data.amount;
        transaction.payerAccount = queryObj.data.customerMsisdn;
        await transaction.save();

        if (
          transaction.callbackUrl &&
          (transaction.status === "fully paid" ||
            transaction.status === "expired" ||
            transaction.status === "suspended") &&
          !transaction.sentCallbackDate
        ) {
          const merchant = await User.findOne({
            name: transaction.merchant,
            role: "merchant",
          });
          if (!merchant) throw Error("Merchant to callback does not exist");

          const hash = generate256Hash(
            transaction.paymentId +
              transaction.orderId +
              transaction.receivedAmount.toString() +
              transaction.currency +
              merchant.apiKey
          );

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
            .post(transaction.callbackUrl, payload, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then(async (resp) => {
              console.log("bkash-fetch-callback-to-mechant-resp", resp.data);
              if (resp.data.success) {
                transaction.sentCallbackDate = new Date();
                await transaction.save();
              }
              console.log(
                "Callback has been sent to the merchant successfully"
              );
            })
            .catch((e) => {
              console.log(
                "bkash-fetch-callback-to-mechant-resp-error",
                e.message
              );
              console.log("Callback to the merchant failed");
            });
        }
      }
    } else {
      console.log(
        "bkash-payment-query-fail",
        queryObj.data.errorCode,
        queryObj.data.errorMessage
      );
      const currentTime = new Date();
      transaction.status = "suspended";
      transaction.statusDate = currentTime;
      await transaction.save();
    }
  } catch (e) {
    console.log("bkash-fetch-error", e.message);
    fetch_bkash(paymentID);
  }
};
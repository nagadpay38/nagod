import React from 'react';

const Document = () => {
  return (
    <div className="p-6 text-sm md:text-base leading-relaxed space-y-4">
      <h1 className="text-2xl font-bold text-indigo-600">Nagodpay API Documentation</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">📌 Payment API Overview</h2>
        <p>
          This API is designed to initiate peer-to-peer (P2P) payment requests through supported mobile financial services 
          (e.g., bKash, Nagad, etc.) for registered and active merchants. It validates inputs, checks merchant status, 
          and returns a payment link for the user to complete the transaction.
        </p>
        
        <h3 className="font-semibold mt-4">🧾 Endpoint</h3>
        <p><strong>URL:</strong> POST <code>/api/payment/payment</code></p>
        <p><strong>Example:</strong> <code>https://api.nagodpay.com/api/payment/payment</code></p>

        <h3 className="font-semibold mt-4">🛡️ Headers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Key</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Required</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">x-api-key</td>
                <td className="border p-2">String</td>
                <td className="border p-2">✅ Yes</td>
                <td className="border p-2">Merchant's unique API key for access</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold mt-4">📤 Request Body</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "provider": "bkash",               // Required: MFS provider (e.g., bkash, nagad)
  "amount": 400,                     // Required: Amount to pay
  "mid": "hobet",                    // Required: Merchant ID (username)
  "orderId": "AkWjV-EU",             // Required: Unique order identifier
  "currency": "BDT",                 // Required: BDT, INR, or USD
  "payerId": "F8C549",               // Required: User or player ID
  "redirectUrl": "http://localhost:5173", // Required: After payment
  "callbackUrl": "http://localhost:8080/admin/deposit-success" // Optional/Recommended: Server notification URL
}`}
        </pre>

        <h3 className="font-semibold mt-4">💰 Minimum Amount by Currency</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Currency</th>
                <th className="border p-2">Minimum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">BDT</td>
                <td className="border p-2">300</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold mt-4">🧪 Example Request</h3>
        <p><strong>Headers:</strong></p>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`x-api-key: merchant_api_key
Content-Type: application/json`}
        </pre>
        <p><strong>Body:</strong></p>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "provider": "bkash",
  "amount": 400,
  "mid": "hobet",
  "orderId": "AkWjV-EU",
  "currency": "BDT",
  "payerId": "F8C549",
  "redirectUrl": "http://localhost:5173",
  "callbackUrl": "http://localhost:8080/admin/deposit-success"
}`}
        </pre>

        <h3 className="font-semibold mt-4">🟢 Success Response</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "message": "Payment link created.",
  "orderId": "AkWjV-EU",
  "paymentId": "eF9mJc3V",
  "link": "http://localhost:3000/checkout/eF9mJc3V"
}`}
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">💰 Payout API Documentation</h2>
        <h3 className="font-semibold mt-2">Overview</h3>
        <p>
          This API allows merchants to request payouts (withdrawals) for their users. The system assigns each payout request 
          to an available agent with sufficient balance and provides tracking through a unique payment ID.
        </p>

        <h3 className="font-semibold mt-4">Base URL</h3>
        <p><code>https://api.nagodpay.com/api/payment/payout</code></p>

        <h3 className="font-semibold mt-4">Authentication</h3>
        <p>Required header: <code>x-api-key</code></p>
        <p>The API key must belong to an activated merchant account</p>

        <h3 className="font-semibold mt-4">Request</h3>
        <p><strong>HTTP Method:</strong> POST</p>

        <h4 className="font-semibold mt-2">Headers</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`Content-Type: application/json
x-api-key: [MERCHANT_API_KEY]`}
        </pre>

        <h4 className="font-semibold mt-2">Request Body</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant_id",
  "provider": "payment_provider",
  "orderId": "unique_order_id",
  "payeeId": "recipient_id",
  "payeeAccount": "recipient_account",
  "callbackUrl": "https://merchant.com/callback",
  "amount": "100.00",
  "currency": "BDT"
}`}
        </pre>

        <h4 className="font-semibold mt-2">Field Descriptions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Required</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">mid</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Merchant ID</td>
              </tr>
              <tr>
                <td className="border p-2">provider</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Payment provider (e.g., "bkash", "nagad", "bank")</td>
              </tr>
              <tr>
                <td className="border p-2">orderId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Unique order ID from merchant (used for duplicate checking)</td>
              </tr>
              <tr>
                <td className="border p-2">payeeId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Recipient's unique identifier in merchant's system</td>
              </tr>
              <tr>
                <td className="border p-2">payeeAccount</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Recipient's account number/wallet number</td>
              </tr>
              <tr>
                <td className="border p-2">callbackUrl</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">URL where payout status updates will be sent</td>
              </tr>
              <tr>
                <td className="border p-2">amount</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Payout amount (must meet currency-specific minimum/maximum requirements)</td>
              </tr>
              <tr>
                <td className="border p-2">currency</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Currency code (BDT, INR, or USD)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold mt-4">Response</h3>
        <h4 className="font-semibold mt-2">Success Response (200)</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "message": "Payout request received and assigned to an agent.",
  "orderId": "unique_order_id",
  "link": "https://merchant.com/callback",
  "paymentId": "ABC123XYZ",
  "assignedAgent": "agent_name"
}`}
        </pre>

        <h4 className="font-semibold mt-2">Callback Field Descriptions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">success</td>
                <td className="border p-2">boolean</td>
                <td className="border p-2">Indicates if the operation was successful</td>
              </tr>
              <tr>
                <td className="border p-2">paymentId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Unique payment ID generated by the system</td>
              </tr>
              <tr>
                <td className="border p-2">orderId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Original order ID from the merchant</td>
              </tr>
              <tr>
                <td className="border p-2">amount</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Payout amount</td>
              </tr>
              <tr>
                <td className="border p-2">currency</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Currency code</td>
              </tr>
              <tr>
                <td className="border p-2">transactionId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Transaction ID from payment provider (empty until processed)</td>
              </tr>
              <tr>
                <td className="border p-2">status</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Current status ("assigned", "processing", "completed", "failed")</td>
              </tr>
              <tr>
                <td className="border p-2">hash</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Security hash for verification</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-semibold mt-2">Status Flow</h4>
        <ul className="list-disc ml-5">
          <li><strong>assigned</strong> - Request received and assigned to an agent</li>
          <li><strong>processing</strong> - Agent has accepted and is processing the request</li>
          <li><strong>completed</strong> - Payout successfully processed</li>
          <li><strong>failed</strong> - Payout failed (with reason)</li>
        </ul>

        <h4 className="font-semibold mt-4">Example React component for initiating payout</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`const handlePayout = async () => {
  try {
    const response = await axios.post(\`\${base_url2}/api/payment/payout\`, {
      mid: "shihab",
      provider: selectedProvider,
      amount: payoutAmount,
      orderId: generateOrderId(),
      payeeId: recipientId,
      payeeAccount: recipientAccount,
      callbackUrl: "http://localhost:8080/admin/withdrawals-take",
      currency: "BDT",
    }, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": merchantApiKey
      }
    });

    if (response.data.success) {
      console.log("Payout initiated:", response.data);
      // Update UI with paymentId and assigned agent
    } else {
      console.error("Payout failed:", response.data.message);
      // Show error to user
    }
  } catch (error) {
    console.error("API error:", error);
    // Show error to user
  }
};`}
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">🔄 Change Payout Status API Documentation</h2>
        <h3 className="font-semibold mt-2">Overview</h3>
        <p>
          This API allows administrators to update the status of a payout transaction. It handles status changes, 
          agent balance updates, commission calculations, and notifications.
        </p>

        <h3 className="font-semibold mt-4">Base URL</h3>
        <p><code>https://api.nagodpay.com/api/payment/changePayoutStatus</code></p>

        <h3 className="font-semibold mt-4">Authentication</h3>
        <p>Requires admin/agent authentication (implied by admin_name parameter)</p>
        <p>Frontend should include agent/admin credentials in the request</p>

        <h3 className="font-semibold mt-4">Request</h3>
        <p><strong>HTTP Method:</strong> POST</p>

        <h4 className="font-semibold mt-2">Headers</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`Content-Type: application/json`}
        </pre>

        <h4 className="font-semibold mt-2">Request Body</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "status": "success",
  "payment_id": "ABC123XYZ",
  "transactionId": "TXN123456",
  "admin_name": "admin123"
}`}
        </pre>

        <h4 className="font-semibold mt-2">Field Descriptions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Required</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">status</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">New status ("success", "failed", "rejected")</td>
              </tr>
              <tr>
                <td className="border p-2">payment_id</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Unique payment ID from the original payout request</td>
              </tr>
              <tr>
                <td className="border p-2">transactionId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Transaction ID from payment provider</td>
              </tr>
              <tr>
                <td className="border p-2">admin_name</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">ID/name of admin/agent performing the update</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold mt-4">Response</h3>
        <h4 className="font-semibold mt-2">Success Response (200)</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "message": "Status updated successfully!"
}`}
        </pre>

        <h4 className="font-semibold mt-2">Status Flow</h4>
        <ul className="list-disc ml-5">
          <li><strong>success</strong> - Payout successfully processed</li>
          <li><strong>failed</strong> - Payout failed during processing</li>
          <li><strong>rejected</strong> - Payout was rejected by admin</li>
        </ul>

        <h4 className="font-semibold mt-4">Example Frontend Implementation</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`const handleSaveUpdate = () => {
  // Validate required fields
  if (!status) {
    showErrorAlert('Status is required!');
    return;
  }

  if (selectedRow) {
    axios.post(\`\${process.env.REACT_APP_BASE_URL}/payment/changePayoutStatus\`, {
      status: newStatus,
      payment_id: selectedRow.transactionId,
      transactionId: transiction_value,
      admin_name: agent_info._id
    }).then((res) => {
      if(res.data.success) {
        showSuccessAlert(res.data.message);
        
        // Handle post-update actions
        if (newStatus === "success") {
          handleResendCallback(selectedRow.transactionId);
        } else {
          fetchUpdatedData();
        }
      } else {
        showErrorAlert(res.data.message);
      }
    }).catch((err) => {
      console.error(err);
      showErrorAlert('Update failed. Please try again.');
    });
  }
  closeModal();
};`}
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">🔄 Resend Callback Payout API Documentation</h2>
        <h3 className="font-semibold mt-2">Overview</h3>
        <p>
          This API allows resending payout status callback notifications to merchant callback URLs. It's typically used 
          when a callback fails initially or when the merchant requests a status update.
        </p>

        <h3 className="font-semibold mt-4">Base URL</h3>
        <p><code>https://api.nagodpay.com/api/payment/resendCallbackPayout</code></p>

        <h3 className="font-semibold mt-4">Authentication</h3>
        <p>Implicit authentication through agent credentials (passed in frontend as authEmail)</p>
        <p>Requires valid payment_id associated with an existing transaction</p>

        <h3 className="font-semibold mt-4">Request</h3>
        <p><strong>HTTP Method:</strong> POST</p>

        <h4 className="font-semibold mt-2">Headers</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`Content-Type: application/json`}
        </pre>

        <h4 className="font-semibold mt-2">Request Body</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "authEmail": "agent@example.com",
  "payment_id": "ABC123XYZ"
}`}
        </pre>

        <h4 className="font-semibold mt-2">Field Descriptions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Required</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">authEmail</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Email of agent/admin making the request</td>
              </tr>
              <tr>
                <td className="border p-2">payment_id</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">Original payment ID of the transaction</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold mt-4">Response</h3>
        <h4 className="font-semibold mt-2">Success Response (200)</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true
}`}
        </pre>

        <h4 className="font-semibold mt-2">Callback Response</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "paymentId": "ABC123XYZ",
  "orderId": "ORDER123",
  "amount": 100.00,
  "currency": "BDT",
  "transactionId": "TXN789",
  "status": "success",
  "hash": "security_hash_value"
}`}
        </pre>

        <h4 className="font-semibold mt-2">Callback Field Descriptions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Parameter</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">paymentId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Original payment ID from payout system</td>
              </tr>
              <tr>
                <td className="border p-2">orderId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Merchant's original order ID</td>
              </tr>
              <tr>
                <td className="border p-2">amount</td>
                <td className="border p-2">number</td>
                <td className="border p-2">Actual sent amount</td>
              </tr>
              <tr>
                <td className="border p-2">currency</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Currency code</td>
              </tr>
              <tr>
                <td className="border p-2">transactionId</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Provider transaction ID</td>
              </tr>
              <tr>
                <td className="border p-2">status</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Current transaction status</td>
              </tr>
              <tr>
                <td className="border p-2">hash</td>
                <td className="border p-2">string</td>
                <td className="border p-2">Security hash for verification</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-semibold mt-4">Example Frontend Implementation</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`const handleResendCallback = (paymentId) => {
  setLoading(true);
  
  axios.post(\`\${process.env.REACT_APP_BASE_URL}/payment/resendCallbackPayout\`, {
    authEmail: agent_info.email,  // Current agent's email for authentication
    payment_id: paymentId        // Payment ID to resend callback for
  })
  .then((response) => {
    if (response.data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Callback Resent',
        text: 'The status callback was successfully resent to the merchant',
        timer: 2000
      });
    } else if (response.data.message) {
      Swal.fire({
        icon: 'info',
        title: 'Notice',
        text: response.data.message,
        showConfirmButton: true
      });
    }
    refreshTransactionData();  // Refresh the transaction list
  })
  .catch((error) => {
    console.error('Callback resend error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Failed to Resend',
      text: error.response?.data?.error || 'An error occurred',
      showConfirmButton: true
    });
  })
  .finally(() => setLoading(false));
};`}
        </pre>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">📱 Bkash Payment Gateway API Documentation</h2>
        <h3 className="font-semibold mt-2">Overview</h3>
        <p>
          This documentation describes the API endpoints for integrating with the Bkash payment gateway through your system. 
          The API allows merchants to create payment links, handle callbacks, and check transaction statuses.
        </p>

        <h3 className="font-semibold mt-4">Base URL</h3>
        <p><strong>Production:</strong> <code>https://eassypay.com/api</code></p>
        <p><strong>Development:</strong> <code>http://localhost:3000</code></p>

        <h3 className="font-semibold mt-4">Authentication</h3>
        <p>All requests must include an API key in the header:</p>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`x-api-key: your_merchant_api_key`}
        </pre>

        <h3 className="font-semibold mt-4">Endpoints</h3>

        <div className="mt-4">
          <h4 className="font-semibold">1. Create Bkash Payment</h4>
          <p><strong>Endpoint:</strong> POST <code>https://api.nagodpay.com/api/payment/p2c/bkash/payment</code></p>
          <p><strong>Description:</strong> Creates a new Bkash payment link for a customer.</p>

          <h5 className="font-semibold mt-2">Request Headers:</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`x-api-key: Merchant API key (required)`}
          </pre>

          <h5 className="font-semibold mt-2">Request Body:</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant_id",
  "orderId": "unique_order_id",
  "payerId": "customer_reference_id",
  "amount": 1000.00,
  "currency": "BDT",
  "redirectUrl": "https://yourwebsite.com/return",
  "callbackUrl": "https://yourwebsite.com/api/callback"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Parameters:</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Parameter</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Required</th>
                  <th className="border p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">mid</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Merchant ID</td>
                </tr>
                <tr>
                  <td className="border p-2">orderId</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Unique order identifier</td>
                </tr>
                <tr>
                  <td className="border p-2">payerId</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Customer reference ID</td>
                </tr>
                <tr>
                  <td className="border p-2">amount</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Transaction amount</td>
                </tr>
                <tr>
                  <td className="border p-2">currency</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Currency code (BDT/USD)</td>
                </tr>
                <tr>
                  <td className="border p-2">redirectUrl</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">URL to redirect after payment</td>
                </tr>
                <tr>
                  <td className="border p-2">callbackUrl</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">URL for payment status updates</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5 className="font-semibold mt-2">Response (Success):</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "message": "Payment link created.",
  "orderId": "unique_order_id",
  "paymentId": "bkash_payment_id",
  "link": "https://bkash.com/payment/url"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Response (Error):</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": false,
  "orderId": "unique_order_id",
  "message": "Error description"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Minimum Amounts:</h5>
          <ul className="list-disc ml-5">
            <li>BDT: 300</li>
            <li>USD: 10</li>
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">2. Bkash Payment Callback</h4>
          <p><strong>Endpoint:</strong> POST <code>https://api.nagodpay.com/api/payment/p2c/bkash/callback</code></p>
          <p><strong>Description:</strong> Bkash server-to-server callback for payment status updates.</p>

          <h5 className="font-semibold mt-2">Request Body (from Bkash):</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "paymentID": "TRX123456789",
  "status": "success",
  "transactionStatus": "Completed",
  "amount": "1000.00",
  "currency": "BDT",
  "trxID": "BKASH_TRX_ID",
  "customerMsisdn": "017XXXXXXXX"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Response:</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "redirectUrl": "https://yourwebsite.com/return"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Callback to Merchant:</h5>
          <p>The system will forward the payment status to your callbackUrl with:</p>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "paymentId": "TRX123456789",
  "orderId": "unique_order_id",
  "amount": 1000.00,
  "currency": "BDT",
  "transactionId": "BKASH_TRX_ID",
  "status": "fully paid",
  "hash": "security_hash"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Status Values:</h5>
          <ul className="list-disc ml-5">
            <li><strong>fully paid</strong>: Successful payment</li>
            <li><strong>processing</strong>: Payment in progress</li>
            <li><strong>hold</strong>: Pending authorization</li>
            <li><strong>expired</strong>: Payment expired</li>
            <li><strong>suspended</strong>: Declined payment</li>
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold">New Endpoint: Execute Payment Callback</h4>
          <p><strong>Endpoint:</strong> POST <code>https://api.nagodpay.com/api/payment/p2c/bkash/callback</code></p>
          <p><strong>Description:</strong> Allows merchants to manually execute or verify a payment callback. This is useful for reconciling payments or handling pending transactions.</p>

          <h5 className="font-semibold mt-2">Request Headers:</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`x-api-key: Merchant API key (required)`}
          </pre>

          <h5 className="font-semibold mt-2">Request Body:</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "payment_type": "Deposit",
  "amount": 1000.00,
  "payment_method": "bkash",
  "status": "completed",
  "customer_id": "user_12345",
  "paymentID": "TRX123456789"
}`}
          </pre>

          <h5 className="font-semibold mt-2">Parameters:</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Parameter</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Required</th>
                  <th className="border p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">payment_type</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Type of payment (Deposit/Withdrawal/etc)</td>
                </tr>
                <tr>
                  <td className="border p-2">amount</td>
                  <td className="border p-2">number</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Transaction amount</td>
                </tr>
                <tr>
                  <td className="border p-2">payment_method</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Payment provider (bkash)</td>
                </tr>
                <tr>
                  <td className="border p-2">status</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Payment status (completed/failed/pending)</td>
                </tr>
                <tr>
                  <td className="border p-2">customer_id</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Your internal customer/user ID</td>
                </tr>
                <tr>
                  <td className="border p-2">paymentID</td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">Bkash transaction ID</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5 className="font-semibold mt-2">Response (Success):</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "message": "Callback processed successfully",
  "transaction": {
    "paymentId": "TRX123456789",
    "status": "fully paid",
    "verified": true
  }
}`}
          </pre>

          <h5 className="font-semibold mt-2">Response (Error):</h5>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": false,
  "message": "Transaction not found",
  "errorCode": "TRX_NOT_FOUND"
}`}
          </pre>
        </div>

        <h3 className="font-semibold mt-6">Frontend Integration</h3>
        <h4 className="font-semibold mt-2">Payment Flow</h4>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Your frontend calls <code>/p2c/bkash/payment</code> with payment details</li>
          <li>The API returns a Bkash payment URL</li>
          <li>Redirect customer to the URL</li>
          <li>Bkash processes payment and calls our callback endpoint</li>
          <li>Our system forwards status to your callbackUrl</li>
          <li>Customer is redirected to your redirectUrl</li>
        </ol>

        <h4 className="font-semibold mt-4">Example Frontend Code</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`const handle_bkash_deposit = async (e) => {
  e.preventDefault();
  
  // Validate amount
  if (!transactionAmount || transactionAmount < 300) {
    alert("Minimum amount is 300 BDT");
    return;
  }

  try {
    const apiKey = "your_merchant_api_key";
    const orderId = generateUniqueOrderId(); // Implement this function
    
    const { data } = await axios.post(
      \`\${base_url}/api/p2c/bkash/payment\`,
      {
        mid: "your_merchant_id",
        payerId: "customer_reference",
        amount: transactionAmount,
        currency: "BDT",
        redirectUrl: \`\${window.location.origin}/return\`,
        orderId: orderId,
        callbackUrl: \`\${window.location.origin}/api/callback\`
      },
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (data.success) {
      window.location.href = data.link;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed");
  }
};`}
        </pre>

        <h4 className="font-semibold mt-4">Frontend Integration Example (Execute Callback)</h4>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`const executePaymentCallback = async () => {
  try {
    const response = await axios.post(
      \`\${base_url}/api/payment/p2c/bkash/callback\`,
      {
        payment_type: "Deposit",
        amount: amount,
        payment_method: "bkash",
        status: status === "cancel" ? "failed" : status,
        customer_id: user_info._id,
        paymentID: transactionId,
      },
      {
        headers: {
          "x-api-key": "your_merchant_api_key",
        },
      }
    );
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    return false;
  }
};`}
        </pre>
      </section>
    </div>
  );
};

export default Document;
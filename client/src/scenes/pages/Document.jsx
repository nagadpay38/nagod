import React from 'react';

const Document = () => {
  return (
    <div className="p-6 text-sm md:text-base leading-relaxed space-y-4">
      <h1 className="text-2xl font-bold text-indigo-600">Nagodpay API QUICK GUIDE</h1>

      <p>
        The API uses header API key authentication. All requests are <strong>POST</strong> methods, and all request/response data are in <strong>JSON</strong> format.
        Every request body <strong>must</strong> include <code>mid</code> in the payload and <code>x-api-key</code> in the headers.
      </p>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">Request Header</h2>
        <ul className="list-disc ml-5">
          <li><code>Content-Type</code>: <code>application/json</code></li>
          <li><code>x-api-key</code>: <code>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">Initiate Payment</h2>
        <p><strong>Endpoint:</strong> <code>https://api.nagodpay.com/api/payment/payment</code></p>

        <h3 className="font-semibold">Request Body:</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant1",
  "provider": "bkash",
  "orderId": "order-123",
  "payerId": "payer-123",
  "amount": "2000",
  "currency": "BDT",
  "redirectUrl": "https://merchant1.com/payment_done",
  "callbackUrl": "https://merchant1.com/api/callback_payment_easyapy"
}`}
        </pre>

        <h3 className="font-semibold">Response:</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "orderId": "order-123",
  "message": "Payment link created",
  "paymentId": "654321",
  "link": "https://api.nagodpay.com/checkout/654321"
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">Callback Data (POST to callbackUrl)</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "status": "fully paid",
  "paymentId": "654321",
  "transactionId": "trx-123",
  "orderId": "order-123",
  "amount": "2000",
  "currency": "BDT",
  "hash": "sdfsdfsdfsdfsdfsdf"
}`}
        </pre>
        <p><strong>Hash Generation (Node.js):</strong></p>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`const string_hash = paymentId + orderId + amount + currency + apiKey;
const hash = crypto.createHash('sha256').update(string_hash).digest('hex');`}
        </pre>

        <h3 className="font-semibold">Payment Statuses:</h3>
        <ul className="list-disc ml-5">
          <li>processing – Payment received and waiting for verification</li>
          <li>fully paid – Received full amount</li>
          <li>partially paid – Amount is different from expected</li>
          <li>expired – Payment link expired</li>
          <li>suspended – Fraud detected</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">Fetching Payment Status</h2>
        <p><strong>Endpoint:</strong> <code>https://api.nagodpay.com/api/payment/paymentStatus</code></p>
        <h3 className="font-semibold">Request Body:</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant1",
  "orderId": "order-123"
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">Fetching Available Payment Providers</h2>
        <p><strong>Endpoint:</strong> <code>https://api.nagodpay.com/api/payment/paymentProviders</code></p>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant1"
}`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">Initiate Payout</h2>
        <p><strong>Endpoint:</strong> <code>https://api.nagodpay.com/api/payment/payout</code></p>
        <h3 className="font-semibold">Example Request Body:</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant1",
  "provider": "bkash",
  "orderId": "order-456",
  "payeeId": "payee-123",
  "payeeAccount": "01734343433",
  "amount": "2000",
  "currency": "BDT",
  "callbackUrl": "https://merchant1.com/api/callback_payout_easypay"
}`}
        </pre>

        <h3 className="font-semibold">Payout Callback:</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "success": true,
  "status": "sent",
  "paymentId": "654321",
  "transactionId": "trx-123",
  "orderId": "order-456",
  "amount": "2000",
  "currency": "BDT",
  "hash": "sdfsdfsdfsdf"
}`}
        </pre>

        <h3 className="font-semibold">Payout Status List:</h3>
        <ul className="list-disc ml-5">
          <li>assigned – Assigned to agent</li>
          <li>sent – Sent successfully</li>
          <li>rejected – Rejected</li>
          <li>failed – No account found / error</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800">P2C Bkash Payment</h2>
        <p><strong>Endpoint:</strong> <code>https://api.nagodpay.com/api/payment/p2c/bkash/payment</code></p>
        <h3 className="font-semibold">Example Request:</h3>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
{`{
  "mid": "merchant1",
  "orderId": "order-123",
  "payerId": "payer-123",
  "amount": "2000",
  "currency": "BDT",
  "redirectUrl": "https://merchant1.com/payment_done",
  "callbackUrl": "https://merchant1.com/api/callback_payment_easyapy"
}`}
        </pre>
      </section>
    </div>
  );
};

export default Document;

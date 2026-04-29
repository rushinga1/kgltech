import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';

const PORT = Number(process.env.PORT || 4242);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in server/.env');
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'rwf' } = req.body || {};

    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error.' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.warn(`KTS Stripe server running on http://localhost:${PORT}`);
});


// server.js
const express = require('express');
const stripe = require('stripe')('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');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const YOUR_DOMAIN = "https://bahjat-bpo-services.vercel.app/";

app.post('/create-checkout-session', async (req, res) => {
  const { price, productName } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['cashapp'],   // ✅ Cash App Only

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],

      mode: 'payment',
      success_url: `${YOUR_DOMAIN}`,
      cancel_url: `${YOUR_DOMAIN}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));

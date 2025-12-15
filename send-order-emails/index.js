
const express = require('express');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
    });
}

const db = admin.firestore();
console.log('Firestore project initialized:', admin.app().options.projectId);

if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY missing!");
    process.exit(1);
} else {
    console.log("SENDGRID_API_KEY is set.");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

function renderProductsHTML(products) {
    return products
        .map(p => `
    <li>
      <strong>${p.title}</strong><br>
      Memory: ${p.storage}<br>
      Color: ${p.color}<br>
      Qty: ${p.quantity}<br>
      Price: ${p.price}
    </li>
  `)
        .join('');

}

app.post('/', async (req, res) => {
    try {
        const { customer, products, total } = req.body;

        if (!customer?.email || !products?.length) {
            console.warn("Invalid order received:", req.body);
            return res.status(400).send('Comandă invalidă');
        }

        console.log('Save order în Firestore...');
        console.log('Payload:', JSON.stringify(req.body, null, 2));

        let orderRef;
        try {
            orderRef = await db.collection('orders').add({
                customer,
                products,
                total,
                status: 'new',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('order saved with ID:', orderRef.id);
        } catch (err) {
            console.error('Firestore ERROR:', err);
            return res.status(500).send('Firestore error: ' + (err.message || err));
        }

        const clientEmail = {
            to: customer.email,
            from: 'kostakuqo5@gmail.com',
            subject: 'Megaelectronic - Ju informon detajet e porosise tuaj!',
            html: `<h2>Pershendetje ${customer.name}!</h2><ul>${renderProductsHTML(products)}</ul><p><strong>Total:</strong> $${total}</p>`
        };

        const sellerEmail = {
            to: 'kostakuqo7@gmail.com',
            from: 'kostakuqo5@gmail.com',
            subject: '🛒 Porosi e Re',
            html: `<h2>Porosi e re</h2><ul>${renderProductsHTML(products)}</ul><p><strong>Total:</strong> $${total}</p>`
        };

        try {
            const results = await Promise.allSettled([sgMail.send(clientEmail), sgMail.send(sellerEmail)]);
            results.forEach((r, i) => {
                if (r.status === 'fulfilled') console.log(`Email ${i} trimis cu succes`);
                if (r.status === 'rejected') console.error(`Email ${i} ERROR:`, r.reason.response ? r.reason.response.body : r.reason);
            });
        } catch (err) {
            console.error('SendGrid ERROR unexpected:', err);
            return res.status(500).send('Eroare la trimiterea emailurilor');
        }

        res.status(200).json({ success: true, orderId: orderRef.id });

    } catch (err) {
        console.error('Unexpected ERROR:', err);
        res.status(500).send('Eroare server: ' + (err.message || err));
    }
});

app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(204);
});


app.get('/get-orders', async (req, res) => {
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, orders });
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
});

app.post('/update-order-status', async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.json({ success: false, error: 'Missing parameters' });
    try {
        const orderRef = db.collection('orders').doc(orderId);
        await orderRef.update({ status });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 8080;

if (require.main === module) { 
    app.listen(PORT, () => {
        console.log(`Server running locally on http://localhost:${PORT}`);
    });
}



module.exports.sendOrderEmails = app;

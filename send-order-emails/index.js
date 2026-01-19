const express = require('express');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
    });
}

const db = admin.firestore();
console.log('Firestore project initialized:', admin.app().options.projectId);

// Check SendGrid API key
if (!process.env.SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY missing!");
    process.exit(1);
} else {
    console.log("SENDGRID_API_KEY is set.");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(express.json());

// CORS setup
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// --- Helper function to render products ---
function renderProductsHTML(products) {
    return products.map(p => `
        <li>
            <strong>${p.title}</strong><br>
            Memory: ${p.storage ? p.storage.memory : 'N/A'}<br>
            Color: ${p.color || 'N/A'}<br>
            Qty: ${p.quantity || 0}<br>
            Price: $${p.storage ? p.storage.price : p.price || 0}
        </li>
    `).join('');
}

// --- Create new order + send emails ---
app.post('/', async (req, res) => {
    try {
        const { customer, products, total } = req.body;

        if (!customer?.email || !products?.length) {
            return res.status(400).send('Porosi invalide!!');
        }

        // Save order in Firestore
        const orderRef = await db.collection('orders').add({
            customer,
            products,
            total,
            status: 'new',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Order saved with ID:', orderRef.id);

        // Prepare emails
        const clientEmail = {
            to: customer.email,
            from: 'kostakuqo5@gmail.com',
            subject: 'Megaelectronic - Ju informon detajet e porosise tuaj!',
            html: `<h2>Përshëndetje ${customer.name}!</h2><ul>${renderProductsHTML(products)}</ul><p><strong>Total:</strong> $${total}</p>`
        };

        const sellerEmail = {
            to: 'kostakuqo7@gmail.com',
            from: 'kostakuqo5@gmail.com',
            subject: '🛒 Porosi e Re',
            html: `<h2>Porosi e re</h2><ul>${renderProductsHTML(products)}</ul><p><strong>Total:</strong> $${total}</p>`
        };

        const results = await Promise.allSettled([sgMail.send(clientEmail), sgMail.send(sellerEmail)]);
        results.forEach((r, i) => {
            if (r.status === 'fulfilled') console.log(`Email ${i} trimis cu succes`);
            if (r.status === 'rejected') console.error(`Email ${i} ERROR:`, r.reason.response ? r.reason.response.body : r.reason);
        });

        res.status(200).json({ success: true, orderId: orderRef.id });

    } catch (err) {
        console.error('Unexpected ERROR:', err);
        res.status(500).send('Eroare server: ' + (err.message || err));
    }
});

// --- Get orders ---
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

// --- Update order status ---
app.post('/update-order-status', async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.json({ success: false, error: 'Missing parameters' });
    try {
        await db.collection('orders').doc(orderId).update({ status });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
});

// --- CORS preflight ---
app.options('*', (req, res) => res.sendStatus(204));

// --- Start server ---
const PORT = process.env.PORT || 8080;
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running locally on http://localhost:${PORT}`);
    });
}

module.exports.sendOrderEmails = app;

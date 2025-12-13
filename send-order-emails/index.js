const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function renderProductsHTML(products) {
    return products.map(p => `
        <li>
            <strong>${p.title}</strong><br>
            Color: ${p.color || '-'}<br>
            Memory: ${p.storage || '-'}<br>
            Qty: ${p.quantity}<br>
            Price: ${p.price}
        </li>
    `).join('');
}

exports.sendOrderEmails = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }

    try {
        const { customer, products, total } = req.body;

        if (!customer?.email || !products?.length) {
            console.error('Invalid order data:', req.body);
            return res.status(400).send('Invalid order');
        }

        const clientEmail = {
            to: customer.email,
            from: 'kostakuqo5@gmail.com',
            subject: 'Megaelectronic detajet e porosise tuaj',
            replyTo: 'kostakuqo5@gmail.com',
            html: `<h2>Pershendetje! ${customer.name}</h2>
           <p>Megaelectronic ju informon porosine tuaj:</p>
           <ul>${renderProductsHTML(products)}</ul>
           <p><strong>Total:</strong> $${total}</p>
           <p>Porosia mberrin ne adresen: ${customer.address}</p>`
        };

        const sellerEmail = {
            to: 'kostakuqo7@gmail.com',
            from: 'kostakuqo5@gmail.com',
            replyTo: 'kostakuqo5@gmail.com',
            subject: '🛒 Porosi e re',
            html: `<h2>Porosi e re </h2>
           <p>Client: ${customer.name}</p>
           <p>Telefon: ${customer.phone}</p>
           <p>Adresă: ${customer.address}</p>
           <ul>${renderProductsHTML(products)}</ul>
           <p><strong>Total:</strong> $${total}</p>`
        };

        await Promise.all([
            sgMail.send(clientEmail),
            sgMail.send(sellerEmail)
        ]);

        res.status(200).json({ success: true });

    } catch (err) {
        console.error('Error sending emails:', err.response?.body || err);
        res.status(500).send('Email failed');
    }
};

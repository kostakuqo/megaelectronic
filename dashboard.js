const SERVER_URL = 'http://localhost:8080';

const loginContainer = document.getElementById('login-container');
const ordersContainer = document.getElementById('orders-container');
const ordersList = document.getElementById('orders-list');
const loginError = document.getElementById('login-error');

let ordersData = [];
let activeFilter = 'all';


document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === 'kostakuqo5@gmail.com' && password === 'Kosta1234#') {
        loginContainer.style.display = 'none';
        ordersContainer.style.display = 'flex';
        loadOrders();
    } else {
        loginError.innerText = 'Email ose fjalëkalimi gabim.';
    }
});


document.querySelectorAll('.orders-nav ul li').forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();

        activeFilter = tab.dataset.filter;

        document.querySelectorAll('.orders-nav ul li')
            .forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        renderOrders();
    });
});


async function loadOrders() {
    ordersList.innerHTML = 'Po ngarkohen porositë...';

    try {
        const res = await fetch(`${SERVER_URL}/get-orders`);
        const data = await res.json();

        if (!data.success) throw new Error(data.error);

        ordersData = data.orders || [];
        renderOrders();

    } catch (err) {
        ordersList.innerHTML = 'Gabim gjatë ngarkimit të porosive';
        console.error(err);
    }
}


function getStatusBadge(status) {
    if (status === 'new') return '<span class="badge new">NEW</span>';
    if (status === 'processed') return '<span class="badge processed">IN PROCESS</span>';
    if (status === 'done') return '<span class="badge done">DONE</span>';
    return '<span class="badge">UNKNOWN</span>';
}

function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';

    let date;

    if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {

        date = new Date(timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1000000));
    } else {
        date = new Date(timestamp);
    }

    if (isNaN(date)) return 'N/A';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}



function renderOrders() {
    ordersList.innerHTML = '';

    const filteredOrders = ordersData.filter(order => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'new') return order.status === 'new';
        if (activeFilter === 'processed') return order.status === 'processed';
        if (activeFilter === 'finished') return order.status === 'done';
        return false;
    });

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = 'Nuk ka porosi me këtë status';
        return;
    }

    filteredOrders.forEach(order => {
        const customer = order.customer || {};
        const products = order.products || [];

        let actionButton = '';

        if (order.status === 'new') {
            actionButton = `
                <button class="status-btn" data-id="${order.id}" data-next="processed">
                    Mark as Processed
                </button>`;
        }

        if (order.status === 'processed') {
            actionButton = `
                <button class="status-btn" data-id="${order.id}" data-next="done">
                    Mark as Done
                </button>`;
        }

        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <h3>Order #${order.id}</h3>

            <p><strong>Data dhe ora:</strong> ${order.createdAt ? formatDateTime(order.createdAt) : 'N/A'}</p>

            <p><strong>Client:</strong> ${customer.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${customer.email || 'N/A'}</p>
            <p><strong>Telefon:</strong> ${customer.phone || 'N/A'}</p>
            <p><strong>Adresë:</strong> ${customer.address || 'N/A'}</p>

            <p><strong>Total:</strong> $${order.total || 0}</p>
            <div class="order-status">
                ${getStatusBadge(order.status)}
            </div>

            <ul>
                ${products.map(p => `<li>
                    <strong>Produkti:</strong> ${p.title} - 
                    ${p.storage ? p.storage.memory : 'N/A'} - 
                    ${p.color || 'N/A'} - 
                    ${p.quantity} x $${p.storage ? p.storage.price : p.price}
                </li>`).join('')}
            </ul>

            ${actionButton}
        `;

        ordersList.appendChild(card);
        console.log('Order ID:', order.id, 'createdAt:', order.createdAt);
    });

    attachStatusEvents();
}


function attachStatusEvents() {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const orderId = btn.dataset.id;
            const nextStatus = btn.dataset.next;

            try {
                const res = await fetch(`${SERVER_URL}/update-order-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId, status: nextStatus })
                });

                const result = await res.json();

                if (result.success) {
                    const order = ordersData.find(o => o.id == orderId);
                    if (order) order.status = nextStatus;

                    renderOrders();
                } else {
                    alert('Gabim gjatë ndryshimit të statusit');
                }

            } catch (err) {
                console.error(err);
                alert('Gabim server');
            }
        });
    });
}

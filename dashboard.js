
    const SERVER_URL = 'http://localhost:8080';

    const loginContainer = document.getElementById('login-container');
    const ordersContainer = document.getElementById('orders-container');
    const ordersList = document.getElementById('orders-list');
    const loginError = document.getElementById('login-error');

    let loggedIn = false;


    document.getElementById('login-btn').addEventListener('click', () => {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      if (email === 'kostakuqo5@gmail.com' && password === 'Kosta1234#') {
        loggedIn = true;
        loginContainer.style.display = 'none';
        ordersContainer.style.display = 'flex';
        loadOrders();
      } else {
        loginError.innerText = 'Email sau parola incorecte.';
      }
    });

    async function loadOrders() {
      ordersList.innerHTML = "Se încarcă comenzile...";
      try {
        const res = await fetch(`${SERVER_URL}/get-orders`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        ordersList.innerHTML = '';
        data.orders.forEach(order => {
          const customer = order.customer || {};
          const products = Array.isArray(order.products) ? order.products : [];
          const card = document.createElement('div');
          card.className = 'order-card';
          card.innerHTML = `
                <h3>Order ID: ${order.id}</h3>
                <p><strong>Client:</strong> ${customer.name || 'N/A'} (${customer.email || 'N/A'})</p>
                <p><strong>Telefon:</strong> ${customer.phone || 'N/A'}</p>
                <p><strong>Adresă:</strong> ${customer.address || 'N/A'}</p>
                <p><strong>Total:</strong> $${order.total || 0}</p>
                <p><strong>Status:</strong> <span class="status-text">${order.status || 'N/A'}</span></p>
                <p><strong>Produse:</strong></p>
                <ul>
                    ${products.map(p => `<li>${p.title} - ${p.quantity} x ${p.price} (${p.color || 'N/A'}, ${p.storage || 'N/A'})</li>`).join('')}
                </ul>
                <button class="status-btn" data-id="${order.id}">Mark as Processed</button>
            `;
          ordersList.appendChild(card);
        });

        document.querySelectorAll('.status-btn').forEach(btn => {
          btn.addEventListener('click', async e => {
            const orderId = e.target.dataset.id;
            try {
              const res = await fetch(`${SERVER_URL}/update-order-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: 'processed' })
              });
              const result = await res.json();
              if (result.success) {
                const card = e.target.closest('.order-card');
                const statusElem = card.querySelector('.status-text');
                if (statusElem) statusElem.innerText = 'processed';
                e.target.disabled = true;
              } else {
                alert('Eroare la actualizarea statusului!');
              }
            } catch (err) {
              console.error(err);
              alert('Eroare la actualizarea statusului!');
            }
          });
        });

      } catch (err) {
        ordersList.innerHTML = "Eroare la încărcarea comenzilor: " + err.message;
        console.error(err);
      }
    }
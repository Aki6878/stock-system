const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

let stockDatabase = [];
let historyDatabase = [];

app.get('/api/stock', (req, res) => res.json(stockDatabase));
app.get('/api/history', (req, res) => res.json(historyDatabase));

app.post('/api/stock', (req, res) => {
    const { shelfId, productName, productId, maker, staff, quantity, type } = req.body;
    let item = stockDatabase.find(i => i.shelfId === shelfId && i.productId === productId);
    
    if (!item) {
        item = { shelfId, productName, productId, maker, quantity: 0 };
        stockDatabase.push(item);
    }
    
    if (type === 'in') item.quantity += quantity;
    else if (type === 'out') item.quantity = Math.max(0, item.quantity - quantity);
    
    historyDatabase.unshift({
        date: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        staff,
        type: type === 'in' ? '入庫' : '出庫',
        shelfId,
        productName,
        productId,
        quantity,
        remaining: item.quantity
    });
    
    if (historyDatabase.length > 100) historyDatabase.pop();
    res.status(200).json({ success: true, currentQuantity: item.quantity });
});

app.get('/list', (req, res) => res.sendFile(path.join(__dirname, 'public', 'list.html')));
app.listen(3000, () => console.log("Server running on port 3000"));

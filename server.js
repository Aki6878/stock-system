const express = require('express');
const path = require('path'); // 追加：ファイルを返すための仕組み
const app = express();
app.use(express.json());
app.use(express.static('public'));

// 在庫データを保存する配列
let stockDatabase = [];
// 🕒 入出庫の履歴を保存する配列
let historyDatabase = [];

// 📦 現在の在庫一覧を取得するAPI
app.get('/api/stock', (req, res) => {
    res.json(stockDatabase);
});

// 🕒 入出庫履歴を取得するAPI
app.get('/api/history', (req, res) => {
    res.json(historyDatabase);
});

// 📄 新設：在庫一覧ページ（list.html）を表示するための設定
app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'list.html'));
});

// ➕➖ 入出庫を処理するAPI
app.post('/api/stock', (req, res) => {
    const { shelfId, productName, productId, maker, quantity, type } = req.body;
    
    let item = stockDatabase.find(i => i.shelfId === shelfId && i.productId === productId);
    
    if (!item) {
        item = { shelfId, productName, productId, maker, quantity: 0 };
        stockDatabase.push(item);
    } else {
        item.productName = productName;
        item.maker = maker;
    }
    
    if (type === 'in') {
        item.quantity += quantity;
    } else if (type === 'out') {
        item.quantity -= quantity;
        if (item.quantity < 0) item.quantity = 0;
    }

    const now = new Date();
    const jstDate = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

    historyDatabase.unshift({
        date: jstDate,
        type: type === 'in' ? '入庫' : '出庫',
        shelfId,
        productName,
        productId,
        quantity
    });

    if (historyDatabase.length > 100) {
        historyDatabase.pop();
    }
    
    res.status(200).json({ success: true, currentQuantity: item.quantity });
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running on port 3000"));

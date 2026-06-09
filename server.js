const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// 在庫データを保存する配列
let stockDatabase = [];

// 📦 現在の在庫一覧をすべて取得するAPI（新設）
app.get('/api/stock', (req, res) => {
    res.json(stockDatabase);
});

// ➕➖ 入出庫を処理するAPI
app.post('/api/stock', (req, res) => {
    const { shelfId, productName, productId, maker, quantity, type } = req.body;
    
    // 棚番号と製品番号が一致するデータをデータ箱から探す
    let item = stockDatabase.find(i => i.shelfId === shelfId && i.productId === productId);
    
    if (!item) {
        // まだ登録がない場合は、新しく項目を作る
        item = { shelfId, productName, productId, maker, quantity: 0 };
        stockDatabase.push(item);
    } else {
        // 既存のデータがあれば、商品名やメーカーを最新に更新しておく
        item.productName = productName;
        item.maker = maker;
    }
    
    // 計算処理
    if (type === 'in') {
        item.quantity += quantity;
    } else if (type === 'out') {
        item.quantity -= quantity;
        if (item.quantity < 0) item.quantity = 0; // マイナスにならないようにする
    }
    
    res.status(200).json({ success: true, currentQuantity: item.quantity });
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running on port 3000"));
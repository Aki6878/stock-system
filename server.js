const express = require('express');
const path = require('path');
const fs = require('fs'); // 【追加】ファイル操作用
const app = express();
app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = 'stock_data.csv';

// CSV形式で保存するためのヘルパー関数
function saveToCSV(data) {
    const header = "shelfId,productId,productName,maker,quantity\n";
    const rows = data.map(i => `${i.shelfId},${i.productId},${i.productName},${i.maker},${i.quantity}`).join('\n');
    fs.writeFileSync(DATA_FILE, header + rows);
}

// 起動時にCSVからデータを読み込む
if (fs.existsSync(DATA_FILE)) {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const lines = content.split('\n').slice(1);
    stockDatabase = lines.filter(l => l).map(line => {
        const [shelfId, productId, productName, maker, quantity] = line.split(',');
        return { shelfId, productId, productName, maker, quantity: parseInt(quantity) };
    });
}

// 在庫更新APIの中で保存を呼び出す
app.post('/api/stock', (req, res) => {
    // ... (既存の更新ロジック) ...
    
    // 【追加】変更があるたびにCSVに書き出し
    saveToCSV(stockDatabase);
    
    res.status(200).json({ success: true, currentQuantity: item.quantity });
});

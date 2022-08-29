const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const app = express()
console.log(process.env.MONGODB_URI)

const uri = process.env.MONGODB_URI

// set MONGODB_URI

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
	console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
	console.log('mongodb connected!')
})

app.get('/', (req, res) => {
	res.send('HELLO world')
})

app.listen(3000, () => {
	console.log(`Express is running on http://localhost:3000`)
})


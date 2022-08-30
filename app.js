const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const Todo = require('./models/todo') // 載入 Todo model
const app = express()

// set MONGODB_URI
console.log(process.env.MONGODB_URI)

const uri = process.env.MONGODB_URI
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

app.engine('hbs', exphbs({ defaultLayout: 'main' , extname:'.hbs'}))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
	Todo.find() // 取出 Todo model 裡的所有資料
		.lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
		.then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
		.catch(error => console.error(error)) // 錯誤處理
})

app.listen(3000, () => {
	console.log(`Express is running on http://localhost:3000`)
})


const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const Todo = require('./models/todo') // 載入 Todo model
const bodyParser = require('body-parser') // 引用 body-parser
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

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	Todo.find() // 取出 Todo model 裡的所有資料
		.lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
		.then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
		.catch(error => console.error(error)) // 錯誤處理
})

app.get('/todos/new',(req, res) => {
	return res.render('new')
})

app.post('/todos',(req, res) => {
	const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
	return Todo.create({ name })     // 存入資料庫
		.then(() => res.redirect('/')) // 新增完成後導回首頁
		.catch(error => console.log(error))
})

app.get('/todos/:id', (req, res) => {
	const id = req.params.id
	return Todo.findById(id)
		.lean()
		.then((todo) => res.render('detail', { todo }))
		.catch(error => console.log(error))
})

app.get('/todos/:id/edit', (req, res) => {
	const id = req.params.id
	return Todo.findById(id)
		.lean()
		.then((todo) => res.render('edit', { todo }))
		.catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
	const id = req.params.id
	const { name, isDone } = req.body
	return Todo.findById(id) //查詢資料
		.then(todo => {        //如果查詢成功，修改後重新儲存資料
			todo.name = name
			todo.isDone = isDone === "on"
			return todo.save()
		})
		.then(() => res.redirect(`/todos/${id}`)) //如果儲存成功，導向首頁
		.catch(error => console.log(error))
})

app.post('/todos/:id/delete', (req, res) => {
	const id = req.params.id
	return Todo.findById(id)
		.then(todo => todo.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log)
})

app.listen(3000, () => {
	console.log(`Express is running on http://localhost:3000`)
})


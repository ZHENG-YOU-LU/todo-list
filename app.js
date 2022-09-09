const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // 引用 body-parser
const methodOverride = require('method-override') // 載入 method-override

const routes = require('./routes') // 引用路由器
require('./config/mongoose') //引用資料庫
console.log(process.env.MONGODB_URI)

const app = express() 

app.engine('hbs', exphbs({ defaultLayout: 'main' , extname:'.hbs'}))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride("_method"))

// 將 request 導入路由器
app.use(routes)

// app.get('/', (req, res) => {
// 	Todo.find() // 取出 Todo model 裡的所有資料
// 		.lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
// 		.sort({ _id: "asc" }) //根據 _id 升冪排序 ,gitg降冪:"desc"
// 		.then(todos => res.render('index', { todos })) // 將資料傳給 index 樣板
// 		.catch(error => console.error(error)) // 錯誤處理
// })

// app.get('/todos/new',(req, res) => {
// 	return res.render('new')
// })

// app.post('/todos',(req, res) => {
// 	const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
// 	return Todo.create({ name })     // 存入資料庫
// 		.then(() => res.redirect('/')) // 新增完成後導回首頁
// 		.catch(error => console.log(error))
// })

// app.get('/todos/:id', (req, res) => {
// 	const id = req.params.id
// 	return Todo.findById(id)
// 		.lean()
// 		.then((todo) => res.render('detail', { todo }))
// 		.catch(error => console.log(error))
// })

// app.get('/todos/:id/edit', (req, res) => {
// 	const id = req.params.id
// 	return Todo.findById(id)
// 		.lean()
// 		.then((todo) => res.render('edit', { todo }))
// 		.catch(error => console.log(error))
// })

// app.put('/todos/:id', (req, res) => {
// 	const id = req.params.id
// 	const { name, isDone } = req.body
// 	return Todo.findById(id) //查詢資料
// 		.then(todo => {        //如果查詢成功，修改後重新儲存資料
// 			todo.name = name
// 			todo.isDone = isDone === "on"
// 			return todo.save()
// 		})
// 		.then(() => res.redirect(`/todos/${id}`)) //如果儲存成功，導向首頁
// 		.catch(error => console.log(error))
// })

// app.delete('/todos/:id', (req, res) => {
// 	const id = req.params.id
// 	return Todo.findById(id)
// 		.then(todo => todo.remove())
// 		.then(() => res.redirect('/'))
// 		.catch(error => console.log)
// })

app.listen(3000, () => {
	console.log(`Express is running on http://localhost:3000`)
})


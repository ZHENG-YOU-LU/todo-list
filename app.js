const express = require('express')
const session = require('express-session') //引用 express-session
const exphbs = require('express-handlebars') //樣板引擎
const bodyParser = require('body-parser') // 引用 body-parser
const methodOverride = require('method-override') // 載入 method-override
const flash = require('connect-flash') // flash message

if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const routes = require('./routes') // 引用路由器
require('./config/mongoose') //引用資料庫
console.log(process.env.MONGODB_URI)

const usePassport = require('./config/passport') // 載入設定檔，要寫在 express-session 以後

const app = express() 
const PORT = process.env.PORT

app.engine('hbs', exphbs({ defaultLayout: 'main' , extname:'.hbs'}))
app.set('view engine', 'hbs')

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride("_method"))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(flash())

// 
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated()
	res.locals.user = req.user
	res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
	res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
	next()
})

// 將 request 導入路由器
app.use(routes)

app.listen(PORT, () => {
	console.log(`Express is running on http://localhost:${PORT}`)
})


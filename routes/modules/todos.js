// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model
const Todo = require('../../models/todo')

router.get('/new', (req, res) => {
	return res.render('new')
})

router.post('/', (req, res) => {
	const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
	return Todo.create({ name })     // 存入資料庫
		.then(() => res.redirect('/')) // 新增完成後導回首頁
		.catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
	const id = req.params.id
	return Todo.findById(id)
		.lean()
		.then((todo) => res.render('detail', { todo }))
		.catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
	const id = req.params.id
	return Todo.findById(id)
		.lean()
		.then((todo) => res.render('edit', { todo }))
		.catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
	const id = req.params.id
	return Todo.findById(id)
		.then(todo => todo.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log)
})


// 匯出路由模組
module.exports = router
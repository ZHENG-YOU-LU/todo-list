const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

module.exports = app => {
	// 初始化 Passport 模組
	app.use(passport.initialize())
	app.use(passport.session())
  // 設定本地登入策略
	passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) =>{
		User.findOne({ email })
			.then(user =>{
				if(!user) {
					return done(null, false, { message: 'That email is not registered!' })
				}
				return bcrypt.compare(password, user.password).then(isMatch => { //第一個參數是使用者的輸入值，而第二個參數是資料庫裡的雜湊值
					if (!isMatch) {
						return done(null, false, { message: 'Email or Password incorrect.' })
				}
					return done (null, user)
				})
			})
			.catch(error => done(error, false))
	}))
  // 設定序列化與反序列化app.use
	passport.serializeUser((user, done) => {
		console.log(user)
		done(null, user._id)
	})
	passport.deserializeUser((id, done) => {
		User.findById(id)
			.lean()
			.then(user => done(null, user))
			.catch(err => done(err, null))
	})
}
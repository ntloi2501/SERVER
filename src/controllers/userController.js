const db = require ('../models/index')
const CRUDService = require('../services/CRUDService')
const userService = require ('../services/userService.js')

let handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password

if(!email || !password) {
    res.status(500).json({
        errCode: 1,
        message: 'Không có dữ liệu tham chiếu !'
    })
}

let userData = await userService.handleUserLogin(email, password)
// console.log(userData)

//check email exist
//compare password
//return userInfor
//access_token: JWT (json web token)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id

//nếu không có người dùng 
    if(!id) {   
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters !',
            users: []
        })
    }
    let users = await userService.getAllUsers(id)

    // console.log(users)
    // console.log('check_______get users')
//không đúng thông tin user
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}
//sửa
let handleUpdate = async (req, res) => {
    let data = req.body
    let message = await userService.UpdateUserData(data)

    return res.status(200).json(message)
   
}
//xóa
let handleDelete = async (req, res) => {
    let id = req.body.id
    if (!id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing required parameters!'
        })
    }
    let userData = await userService.handleDeleteUser(id)
// console.log('check delete user: ') 
// console.log(userData) 
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage
    })
}
//api create new user
 let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    console.log(message)

    return res.status(200).json(message)
 }
 let getAllCode = async ( req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data)
    } catch (e) {
        console.log('get allcode err: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
 }
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleUpdate: handleUpdate,
    handleDelete: handleDelete,
    handleCreateNewUser: handleCreateNewUser,
    getAllCode: getAllCode
}
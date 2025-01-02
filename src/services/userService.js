const bcrypt = require ('bcryptjs')
const db = require ('../models/index')

const salt = bcrypt.genSaltSync(10)

let hashUserPassword = (password) => {
    return new Promise( async (resolve, rejects) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (e) {
            rejects(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise( async (resolve, rejects) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if(isExist) {
                //user already exist               
                let user = await db.User.findOne({
                    where: { email: email},
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                })
                if (user) {
                    //compare password
                   let check = await bcrypt.compareSync(password, user.password)
                    if(check) {
                        userData.errCode = 0
                        userData.errMessage = 'OK'
                        // console.log(user) //check ở phía backend
                        delete user.password
                        userData.user = user
                    }else {
                        userData.errCode = 3
                        userData.errMessage ='sai mật khẩu !'
                    }
                }else {
                    userData.errCode = 2
                    userData.errMessage = `User's not found~`
                }

            }  else {
                //return error
                userData.errCode = 1
                userData.errMessage = `Email không tồn tại. Vui lòng thử email khác !`
            } 
        resolve(userData)
        } catch (e) {
            rejects(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise( async (resolve, rejects) => {
        try {
            let user = await db.User.findOne({
                where: { email : userEmail}
            })
            if(user) {
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (e) {
            rejects(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, rejects) => {
        try {
            let users = '' 
          if(userId == 'ALL') {
            users = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                }
            })
          }
          if(userId && userId !== 'ALL') {
            users = await db.User.findOne({
                where: {id: userId},
                attributes: {
                    exclude: ['password']
                }
            })
          }
          resolve(users)
        } catch (e) {
            rejects(e)
        }
    })
}
//xử lý sửa
let handleUpdateUser = (id, email, password, roleId) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let userData = {}
            // Kiểm tra xem user có tồn tại hay không
            let user = await db.User.findOne({
                where: { id: id }
            })
            if (user) {
                // Mã hóa lại mật khẩu trước khi lưu
                let hashedPassword = await bcrypt.hashSync(password, 10)
                // Cập nhật thông tin user
                user = await db.User.update(
                    {
                        email: email,
                        password: hashedPassword,
                        roleId: roleId
                    },
                    {
                        where: { id: id }
                    }
                )
                userData.errCode = 0
                userData.errMessage = 'User updated successfully!'
                userData.user = {
                    id: id,
                    email: email,
                    roleId: roleId
                }
            } else {
                userData.errCode = 2
                userData.errMessage = "User not found!"
            }
            resolve(userData)
        } catch (e) {
            rejects(e)
        }
    })
}
//xử lý xóa
let handleDeleteUser = (id) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let userData = {}
            // Kiểm tra xem user có tồn tại không
            let user = await db.User.findOne({
                where: { id: id }
            })
            if (user) {
                // Xóa user
                await db.User.destroy({
                    where: { id: id }
                })
                userData.errCode = 0
                userData.errMessage = 'User deleted successfully!'
            } else {
                userData.errCode = 2
                userData.errMessage = "User not found!"
            }
            resolve(userData)
        } catch (e) {
            rejects(e)
        }
    })
}
//api create new user
let createNewUser = (data) => {
    return new Promise(async(resolve, rejects) => {
        try {
        let check = await checkUserEmail(data.email)
        if(check === true) {
            resolve({
                errCode: 1,
                message: 'Email đã tồn tại, vui lòng nhập email khác'
            })
        }
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        console.log('check add a new user--------')
        console.log(data)
        console.log('check add a new user--------')
            await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,  
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId,
})
        } catch (e) {
            rejects(e)
        }  
    resolve({
        errCode: 0,
        message: 'OK'
    })
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    handleUpdateUser: handleUpdateUser,
    handleDeleteUser: handleDeleteUser,
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword
}
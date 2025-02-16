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
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
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
let UpdateUserData = (data) => {
    return new Promise(async (resolve, rejects) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "khong co du lieu tham chieu"
                })
            }
            let user = await db.User.findOne ({
                where: {id: data.id},
                raw: false
            })
            if(user) {   
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;

                await user.save();
            resolve({
                errCode: 0,
                message: "Update user successed!"
            })
            }else {
                resolve({
                    errCode: 1,
                    errMessage: `user not found!`
                })
            }
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
                errMessage: 'Email đã tồn tại, vui lòng nhập email khác'
            })
        }else {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        // console.log('check add a new user--------')
        // console.log(data)
        // console.log('check add a new user--------')
            await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,  
            gender: data.gender,
            roleId: data.roleId,
            positionId: data.positionId
        })
            resolve({
                errCode: 0,
                message: 'OK'
            })
        }       
    } catch (e) {
            rejects(e)
        }  

    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'không có dữ liệu tham chiếu !'
                });
            }else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    UpdateUserData: UpdateUserData,
    handleDeleteUser: handleDeleteUser,
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllCodeService: getAllCodeService
}
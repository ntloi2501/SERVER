const { rejects } = require("assert")
const { resolve } = require("path")
const bcrypt = require ('bcryptjs')
const db = require ('../models/index')

const salt = bcrypt.genSaltSync(10)


let createNewUser = async (data) => {
return new Promise(async(resolve, rejects) => {
try {
let hashPasswordFromBcrypt = await hashUserPassword(data.password);
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
console.log("-------check add a user-------")
console.log(data)
console.log("-------check add a user-------")
resolve('Ok create a new user successfully!')

} catch (e) {
    
}
})

}
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
let getAllUser = () => {
return new Promise( async (resolve, rejects)=> {
    try {
        let users = db.User.findAll({
            raw: true
        })
        resolve(users)
    } catch (e) {
        rejects(e)
    }
})
}
let getUserInfoById = (userId) => {
return new Promise(async(resolve, rejects) => {
    try {
        let user = await db.User.findOne({
            raw: true,
            where: {id: userId}
        })
        if(user) {
            resolve(user)
        }
        else {
            resolve('không có dữ liệu')
        }
    } catch (e) {
        rejects(e)
    }
})
}
let updateUserData =(data) => {
return new Promise(async(resolve, rejects) => {
    try {
        let user = await db.User.findOne ({
            where: {id: data.id}
        })
        if(user) {
            user.firstName = data.firstName
            user.lastName = data.lastName
            user.address = data.address

            await user.save() 
            let allUsers = await  db.User.findAll()
            resolve(allUsers)
        }else {
            resolve()
        }
    } catch (e) {
        console.log(e)
    }
})
}

let deleteUserById = (userId) => {
return new Promise( async (resolve, rejects) => {
    try {
        let user = await db.User.findOne({
            where: {id: userId}
        })
        if(user) {
           await user.destroy()
        }

        resolve()
    } catch (e) {
        rejects(e)
    }
})
}
module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
} 
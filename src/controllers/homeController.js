const db = require ('../models/index')
const CRUDService = require ('../services/CRUDService')
const getHomePage = async (req, res) => {
    try{
        let data = await db.User.findAll()
        return res.render('homepage.ejs', {
            data : JSON.stringify(data)
        })
    }catch(e) {
        console.log(e)
    }

}
const getAboutPage = (req, res) => {
    return res.render('test/about.ejs')
}
//giao dien va xu ly them nguoi dung
const getCRUD = (req, res)=> {
   return res.render('crud.ejs')
}
const postCRUD = async(req, res)=> {
   let message = await CRUDService.createNewUser(req.body)
   console.log(message)
    return res.send('Create new user succed!')
 }
 //giao dien va xu ly them nguoi dung
 

//giao dien doc tat ca du lieu nguoi dung 
const displayGetCRUD = async (req, res) => {
let data = await CRUDService.getAllUser()
// console.log('--------------')
// console.log(data)
// console.log('--------------')
return res.render('displayCRUD.ejs', {
    dataTable: data
})
}
//giao dien doc tat ca du lieu nguoi dung 

//confirm edit o giao dien
let getEditCRUD = async (req, res) => {
let userId = req.query.id
console.log(userId)
if(userId) {
    let userData = await CRUDService.getUserInfoById(userId)
    console.log('*******check user******')
    console.log(userData)
    console.log('*******check user******')
    // let userData 
    return res.render('editCRUD.ejs' , {
        editData: userData
    })
}
else {
    return res.send('Users not found!')
}

}

//thuc hien thay doi o giao dien
let putCRUD = async (req, res) => {
    let data = req.body
    let allUsers =  await CRUDService.updateUserData(data)


    return res.render('displayCRUD.ejs' , {
        dataTable: allUsers
    })

}
let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if(id) {
        await CRUDService.deleteUserById(id)
        return res.send('Delete user successfully')
    }
    else {
        return res.send('User not found!')
    }
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}
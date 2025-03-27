const express =require('express')
const homeController =require('../controllers/homeController')
const userController =require('../controllers/userController')
const doctorController = require('../controllers/doctorController')
let router = express.Router()

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage) // trang chu
    router.get('/about', homeController.getAboutPage)
    router.get('/crud', homeController.getCRUD) //giao dien addUser
    router.post('/post-crud', homeController.postCRUD) //sau khi tao moi user thanh cong
    router.get('/get-crud', homeController.displayGetCRUD)// doc tat ca du lieu o giao dien
    router.get('/edit-crud', homeController.getEditCRUD) //thuc hien edit o giao dien
    router.post('/put-crud', homeController.putCRUD) //xu ly update o giao dien
    router.get('/delete-crud', homeController.deleteCRUD) 

    
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/login', userController.handleLogin)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/update-user', userController.handleUpdate)
    router.delete('/api/delete-user', userController.handleDelete)
    router.get('/api/allcode', userController.getAllCode)


    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    //api lấy tt bs trong quản lý bs
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    //api lưu tt bs trong quản lý bs
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)


    

    return app.use("/", router)
}

module.exports = initWebRoutes
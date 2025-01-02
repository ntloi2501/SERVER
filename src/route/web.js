const express =require('express')
const homeController =require('../controllers/homeController')
const userController =require('../controllers/userController')

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

    return app.use("/", router)
}

module.exports = initWebRoutes
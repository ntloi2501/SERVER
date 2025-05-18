const { reject } = require("lodash")
const db = require("../models")


let createSpecialty = async ( data ) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name 
                || !data.imageBase64 
                || !data.descriptionHTML 
                || !data.descriptionMarkdown) {
            resolve({
                errCode: 1,
                errMessage: "Vui lòng nhập thông tin.. !"
            })
        }else {

            await db.Specialty.create({
                name: data.name,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
            })
            resolve({
                errCode: 0,
                errMessage: "Lưu thành công data !"
            })

        }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllSpecialty= async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
            })
            if(data && data.length > 0){
                data.map(item => {
                    item.image = new Buffer(item.image, "base64").toString("binary");
                    return item
                }) 
            }
            resolve({
                errCode: 0, 
                errMessage: "OK",
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
}
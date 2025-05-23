
import { reject } from "lodash"
import db from "../models/index"
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (doctorId, token) => {
    let result= `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
let postBookAppointment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Vui lòng nhập email.. "
                })
            }else {
                let token = uuidv4()

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })


              let user = await db.User.findOrCreate({
                    where: { email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    },
                  
                })
                console.log('>>> check create patient: ', user[0])
                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where : { patientId: user[0].id},
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: user[0].id,
                                date: data.date,
                                timeType: data.timeType,
                                token: token
                            }                      
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save Oke !"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
        if(!data.token || !data.doctorId) {
                resolve({
                errCode: 1,
                errMessage: "Vui lòng nhập email.. "
            })
        }else {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorId: data.doctorId,
                    token: data.token,
                    statusId: 'S1'
                },
                raw: false
            })

            console.log('check appointment: ', appointment)
            if(appointment) {
                appointment.statusId = 'S2'
                await appointment.save()
                resolve({
                    errCode: 0,
                    errMessage: "Cập nhật lịch hẹn thành công !"
                })
            }else {
                resolve({
                    errCode: 2,
                    errMessage: "Lịch hẹn đã được kích hoạt hoặc không tồn tại !"
                })
            }
        }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}
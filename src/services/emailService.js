require('dotenv').config
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "587",
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },

    })

    try {
        let info = await transporter.sendMail({
            from: '"Nguyễn Tấn Lợi" <nguyentanloi2501@gmail.com>',
            to: dataSend.receiverEmail,
            subject: "Thông tin đặt lịch khám bệnh ",
            html: getBodyHTMLEmail(dataSend),
        });
    
        console.log('Gửi email thành công:', info);
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
    }
    
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if(dataSend.language === 'vi' ) {
        result = 
        `
        <h3> Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được email này khi đã đặt lịch online trên booking care </p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng 
        click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn !</div>
        
        `
    }

    // if(language === 'en' ) {
    //     result = 
    //     `
    //     <h3> Xin chào ${dataSend.patientName} !</h3>
    //     <p>Bạn nhận được email này khi đã đặt lịch online trên booking care </p>
    //     <p>Thông tin đặt lịch khám bệnh: </p>
    //     <div><b>Thời gian: ${dataSend.time}</b></div>
    //     <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

    //     <p>Nếu các thông tin trên là đúng sự thật, vui lòng 
    //     click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    //     <div>
    //     <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    //     </div>
    //     <div>Xin chân thành cảm ơn !</div>
        
    //     `
    // }
    return result
}

module.exports = {
    sendSimpleEmail
}
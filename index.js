const fs = require('fs')
const mailer = require('nodemailer')
require('dotenv').config()
const message = fs.readFileSync('./Message.html', 'utf8')


//Сканируем txt с почтами
function scanAndSend() {
    // process.env.EMAILS_TO_PATH - Имя файла с почтами
    fs.readFile('./' + process.env.EMAILS_TO_PATH, 'utf8', (err, data) =>{
        // делим содержимое документа по символам process.env.SPLIT_SYMBOL, по дефолту почта разделяются по ", ",
        // но для удобства можно в конфиге поменять на пробел, перенос строки или любой другой
        const emails_to = data.split(process.env.SPLIT_SYMBOL)
        //перебор почт и отправка сообщения 
        emails_to.map(email_to => sendEmail(email_to))
    })
}

// функция для отправки принимает только почту
function sendEmail(email_to) {
    const transporter = mailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email_to,
        subject: 'Что поесть сегодня?',
        html: message
        
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Ошибка отправки:', err)
        } else {
            console.log('Сообщение отправленно:', info.response)
        }
    })
}

scanAndSend()
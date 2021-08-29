require('dotenv').config()
const mailgun = require('mailgun-js')

exports.handler = (event, _context, callback) => {
    const mg = mailgun({ 
        apiKey: process.env.MAILGUN_API_KEY, 
        domain: process.env.MAILGUN_DOMAIN 
    })

    const data = JSON.parse(event.body)

    const content = `
        <html>
        <body>
            <div><strong>First name: </strong><span>${data['firstname']}</span></div>
            <div><strong>Last name: </strong><span>${data['lastname']}</span></div>
            <div><strong>Email: </strong><span>${data['email']}</span></div>
            <div><strong>Phone Number: </strong><span>${data['phone']}</span></div>
            <div><strong>Job title: </strong><span>${data['job']}</span></div>
            <div><strong>Organisation: </strong><span>${data['organisation']}</span></div>
            <div><strong>Website: </strong><span>${data['website']}</span></div>
            <div><strong>Agree to policy?: </strong><span>${data['isAgree'] === 'on' ? 'Yes' : 'No'}</span></div>
        </body>
        </html>
    `

    const emailData = {
        from: 'Corporate Site <pakanan@humancapitalhub.co>',
        to: 'peerawat@odds.team', // pakanan@humancapitalhub.co
        subject: 'New Request from Corporate Site',
        html: content
    }

    mg.messages().send(emailData, (error, response) => {
        callback(error, {
            statusCode: 200,
            body: JSON.stringify(response)
        })
    })
}
require('dotenv').config()
const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_API_KEY);

exports.handler = (event, _context, callback) => {
    const data = JSON.parse(event.body)
    console.log(data)
    Promise.all([
        sendEmailToAdmin({ data }),
        sendEmailToClient({ to: data['email'] }),
    ])
    .then(([ emailToAdminResp, emailToClientResp ]) => {
        console.log(emailToAdminResp)
        console.log(emailToClientResp)
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: 'email sent'
            })
        })
    })
    .catch(err => {
        console.log(err)
        callback(err)
    })
}

function sendEmailToAdmin({ data }) {
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
        </html>`

    const message = {
        from_email: 'pakanan@humancapitalhub.co',
        from_name: 'Request a callback',
        subject: 'New Request from Corporate Site',
        html: content,
        to: [
            {
                email: 'pakanan@humancapitalhub.co',
                type: 'to'
            }
        ]
    }

    return mailchimp.messages.send({ message })
}

function sendEmailToClient({ to }) {
    const content = `
        <html>
        <body>
            <p>Thank you for your request. We will get back to you as soon as possible.</p>
            <p>
                Regards, <br>
                Human Capital Hub (Thailand) Limited
            </p>
        </body>
        </html>`

    const message = {
        from_email: 'pakanan@humancapitalhub.co',
        from_name: 'Human Capital Hub',
        subject: 'Acknowledged request a callback',
        html: content,
        to: [
            {
                email: to,
                type: 'to'
            }
        ]
    }
    
    return mailchimp.messages.send({ message })
}
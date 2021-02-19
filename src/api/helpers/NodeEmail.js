'use strict';
//https://ethereal.email
const nodemailer = require("nodemailer");
const { APP } = require('../../config/config');

class NodeEmail {
    // async..await is not allowed in global scope, must use a wrapper
    async main(data) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            // host: "tx12.fcomet.com",
            port: 587,
            // port: 2525,
            secure: false, // true for 465, false for other ports
            auth: {
                // user: 'jensysantana@ansymax.com', // generated ethereal user
                // pass: 'Vi^n0HWzpy@3'// generated ethereal password
                // user: 'no-replay@ansymax.com', // generated ethereal user
                // pass: 'bEph1e(IZ8&d' // generated ethereal password
                user: 'shad.cormier@ethereal.email',
                pass: 'FMGF48yb435HSp9Vv3'
            },
            tls: {
                rejectAnautorized: false // use in production in true
            }
        });

        // send mail with defined transport object, deonna.foster@gmail.com
        await transporter.sendMail({
            // from: '"" <no-replay@ansymax.com>', // sender address
            from: `${APP.NAME_APP} <no-replay@claford.com>`, // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            text: "Hello Dear?", // plain text body
            html: data.html // html body
        });

        // html: '<b>I love you Deonna foster<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpRdoEX7WAJqm-y0ollXyICxLY3vLGFDWw59vRspenhy0tovUXxQ&s" alt="text of my image"></b>' // html body
        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    async emailData(fname, lname, email, html, subject) {
        // let emailData = {
        //     name: `${fname} ${lname}`,
        //     to: email,
        //     html: html,
        //     subject: subject,
        // };
        return await this.main({
            name: `${fname} ${lname}`,
            to: email,
            html: html,
            subject: subject,
        });
    }

    async accountRecoveredFeedBack({ fname, lname, email, url, appName }, subject) {
        //for account recovered
        const html = `
        <div style="width:100%;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                <tbody>
                    <tr>
                        <td align="center" style="padding-left:20px;padding-right:20px">
                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="width:520px;max-width:520px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;table-layout:fixed!important">
                                <tbody>
                                    <tr>
                                        <td align="left" style="color:#4d4d4d;font-family:Helvetica,sans-serif;line-height:1.42857;padding-top:40px;font-size:24px">
                                            <div style="background-color:#ffffff;padding-top:0;padding-right:0;padding-bottom:20px;padding-left:0">
                                                <div>
                                                    <a style="color:#009ac7;text-decoration:none" href="${url}" target="_blank">
                                                        <img src="${url}/assets/img/logo_light.png" style="vertical-align:middle;width:45%;height:auto;max-width:100%;border-width:0" alt="${appName}">
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-left:20px;padding-right:20px">
                            <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <h2 style="margin-top:2rem"><a href="${url}" target="_blank" style="text-decoration:none;">${appName}</a></h2>
                                                <h3 class="suheader" style="margin-bottom:12px">Dear ${fname} ${lname}</h3>
                                                <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                    Your password account ${email} has been updated successfully.
                                                </p>
                                
                                                <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                    You can sign in by clicking the button below.
                                                </p>

                                                <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                    <a href="${url}/auth/sign-in" style="background:#131415;color:#fff;font-size:14px;border:0;border-radius:4px;display:inline-block;line-height:24px;margin:8px 0;min-height:20px;outline:0;padding:8px 20px;text-align:center;vertical-align:middle;white-space:nowrap;text-decoration:none" target="_blank">
                                                        Sign In
                                                    </a>
                                                </p>
                                
                                                <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                    If you think this reset password looks suspicious, please let us know, we take your security seriously.
                                                </p>
                                
                                                <p>
                                                    <span style="line-height:24px;font-size:16px">Regards,</span><br>
                                                    <span style="line-height:24px;font-size:16px">The ${appName} Team</span>
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr style="margin-top:1.5rem; margin-bottom:2rem;"/>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                <tbody>
                    <tr>
                        <td align="center" style="padding-left:20px;padding-right:20px; boder-top:2px; color:red;">
                            <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <p style="font-size:16px;margin-bottom:15px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                    Questions? Check out the <a href="/faqs">FAQs</a> or get help from <a href="/support">Support</a>.
                                                </p>
                                
                                                <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                    This email was sent from a notification-only address. Please do not reply.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            <table>
        </div>
    `;
        return await this.emailData(fname, lname, email, html, subject);
    }

    async accountRequestRecoveryFromEmail({ fname, lname, email, url, appName, newToken }, subject) {
        //for account recovered
        const html = `
            <div style="width:100%;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                    <tbody>
                        <tr>
                            <td align="center" style="padding-left:20px;padding-right:20px">
                                <table cellpadding="0" cellspacing="0" border="0" align="center" style="width:520px;max-width:520px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;table-layout:fixed!important">
                                    <tbody>
                                        <tr>
                                            <td align="left" style="color:#4d4d4d;font-family:Helvetica,sans-serif;line-height:1.42857;padding-top:40px;font-size:24px">
                                                <div style="background-color:#ffffff;padding-top:0;padding-right:0;padding-bottom:20px;padding-left:0">
                                                    <div>
                                                        <a style="color:#009ac7;text-decoration:none" href="${url}" target="_blank">
                                                            <img src="${url}/assets/img/logo_light.png" style="vertical-align:middle;width:45%;height:auto;max-width:100%;border-width:0" alt="${appName}">
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding-left:20px;padding-right:20px">
                                <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    <h2 style="margin-top:2rem"><a href="${url}" target="_blank" style="text-decoration:none;">${appName}</a></h2>
                                                    <h3 class="suheader" style="margin-bottom:12px">Dear ${fname} ${lname}</h3>
                                                    <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                        Password Reset has been requested of your account ${email}. please follow the instructions bellow.
                                                    </p>
                                    
                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        Your ${appName} password can be reset by clicking the button below. If you did not request a new password, please ignore this email.
                                                    </p>

                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        <a href="${url}/auth/set-password?uaidt=${newToken}" style="background:#131415;color:#fff;font-size:14px;border:0;border-radius:4px;display:inline-block;line-height:24px;margin:8px 0;min-height:20px;outline:0;padding:8px 20px;text-align:center;vertical-align:middle;white-space:nowrap;text-decoration:none" target="_blank">
                                                            Reset my password
                                                        </a>
                                                    </p>
                                    
                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        If you think this reset require looks suspicious, please let us know, we take your security seriously.
                                                    </p>
                                    
                                                    <p>
                                                        <span style="line-height:24px;font-size:16px">Regards,</span><br>
                                                        <span style="line-height:24px;font-size:16px">The ${appName} Team</span>
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr style="margin-top:1.5rem; margin-bottom:2rem;"/>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                    <tbody>
                        <tr>
                            <td align="center" style="padding-left:20px;padding-right:20px; boder-top:2px; color:red;">
                                <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    <p style="font-size:16px;margin-bottom:15px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                        Questions? Check out the <a href="/faqs">FAQs</a> or get help from <a href="/support">Support</a>.
                                                    </p>
                                    
                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        This email was sent from a notification-only address. Please do not reply.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                <table>
            </div>
        `;
        return await this.emailData(fname, lname, email, html, subject);
    }

    async accountRequestRecoveryFromPhone({ fname, lname, email, url, phone, appName, newToken }, subject) {
        //for account recovered
        const html = `
            <div style="width:100%;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                    <tbody>
                        <tr>
                            <td align="center" style="padding-left:20px;padding-right:20px">
                                <table cellpadding="0" cellspacing="0" border="0" align="center" style="width:520px;max-width:520px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;table-layout:fixed!important">
                                    <tbody>
                                        <tr>
                                            <td align="left" style="color:#4d4d4d;font-family:Helvetica,sans-serif;line-height:1.42857;padding-top:40px;font-size:24px">
                                                <div style="background-color:#ffffff;padding-top:0;padding-right:0;padding-bottom:20px;padding-left:0">
                                                    <div>
                                                        <a style="color:#009ac7;text-decoration:none" href="${url}" target="_blank">
                                                            <img src="${url}/assets/img/logo_light.png" style="vertical-align:middle;width:45%;height:auto;max-width:100%;border-width:0" alt="${appName}">
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding-left:20px;padding-right:20px">
                                <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    <h2 style="margin-top:2rem"><a href="${url}" target="_blank" style="text-decoration:none;">${appName}</a></h2>
                                                    <h3 class="suheader" style="margin-bottom:12px">Dear ${fname} ${lname}</h3>
                                                    <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                        Password reset has been request from ${phone} of your account ${email}. please follow the instructions bellow.
                                                    </p>
                                    
                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        You can sign in by clicking the button below. If you did not request a new password change, please ignore this email.
                                                    </p>

                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        <a href="${url}/auth/sign-in" style="background:#131415;color:#fff;font-size:14px;border:0;border-radius:4px;display:inline-block;line-height:24px;margin:8px 0;min-height:20px;outline:0;padding:8px 20px;text-align:center;vertical-align:middle;white-space:nowrap;text-decoration:none" target="_blank">
                                                            Sign In
                                                        </a>
                                                    </p>
                                    
                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        If you think this reset request looks suspicious, please let us know, we take your security seriously.
                                                    </p>
                                    
                                                    <p>
                                                        <span style="line-height:24px;font-size:16px">Regards,</span><br>
                                                        <span style="line-height:24px;font-size:16px">The ${appName} Team</span>
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr style="margin-top:1.5rem; margin-bottom:2rem;"/>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                    <tbody>
                        <tr>
                            <td align="center" style="padding-left:20px;padding-right:20px; boder-top:2px; color:red;">
                                <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div>
                                                    <p style="font-size:16px;margin-bottom:15px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                        Questions? Check out the <a href="/faqs">FAQs</a> or get help from <a href="/support">Support</a>.
                                                    </p>
                                    
                                                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                        This email was sent from a notification-only address. Please do not reply.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                <table>
            </div>
        `;
        return await this.emailData(fname, lname, email, html, subject);
    }

    async signUp({ fname, lname, email, url, appName, newToken }, subject) {
        const html = `
                <div style="width:100%;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                        <tbody>
                            <tr>
                                <td align="center" style="padding-left:20px;padding-right:20px">
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="width:520px;max-width:520px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;table-layout:fixed!important">
                                        <tbody>
                                            <tr>
                                                <td align="left" style="color:#4d4d4d;font-family:Helvetica,sans-serif;line-height:1.42857;padding-top:40px;font-size:24px">
                                                    <div style="background-color:#ffffff;padding-top:0;padding-right:0;padding-bottom:20px;padding-left:0">
                                                        <div>
                                                            <a style="color:#009ac7;text-decoration:none" href="${url}" target="_blank">
                                                                <img src="${url}/assets/img/logo_light.png" style="vertical-align:middle;width:45%;height:auto;max-width:100%;border-width:0" alt="${appName}">
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding-left:20px;padding-right:20px">
                                    <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <h2 style="margin-top:2rem"><a href="${url}" target="_blank" style="text-decoration:none;">${appName}</a></h2>
                                                        <h3 class="suheader" style="margin-bottom:12px">Hi ${fname},</h3>
                                                        <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                            Thanks for signing up to ${appName}.
                                                        </p>
                                                        <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                            To get access to your account please verify your email address ${email} by clicking the button below.
                                                        </p>
                                                        <p style="background-color:#148dcd;text-align:center;font-weight:bold;padding-top:10px;padding-bottom:10px;padding-right:15px;padding-left:15px;color:#ffffff">
                                                            <a style="color:#ffffff;text-decoration:none;font-size:18px;font-weight:normal" href="${url}/auth/account-validate?tcv=${newToken}" target="_blank">
                                                                Verify your email address
                                                            </a>
                                                        </p>
                                        
                                                        <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                            ${appName} is an online and offline shop multi purpose application system.
                                                        </p>
                                        
                                                        <p>
                                                            <span style="line-height:24px;font-size:16px">Regards,</span><br>
                                                            <span style="line-height:24px;font-size:16px">The ${appName} Team</span>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style="margin-top:1.5rem; margin-bottom:2rem;"/>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                        <tbody>
                            <tr>
                                <td align="center" style="padding-left:20px;padding-right:20px; boder-top:2px; color:red;">
                                    <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <p style="font-size:16px;margin-bottom:15px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                            Questions? Check out the <a href="/faqs">FAQs</a> or get help from <a href="/support">Support</a>.
                                                        </p>
                                        
                                                        <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                            This email was sent from a notification-only address. Please do not reply.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    <table>
                </div>
            `;
        return await this.emailData(fname, lname, email, html, subject);
    }
    async signUpFeedBack({ fname, lname, email, url, appName }, subject) {
        const html = `
                <div style="width:100%;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                        <tbody>
                            <tr>
                                <td align="center" style="padding-left:20px;padding-right:20px">
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="width:520px;max-width:520px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;table-layout:fixed!important">
                                        <tbody>
                                            <tr>
                                                <td align="left" style="color:#4d4d4d;font-family:Helvetica,sans-serif;line-height:1.42857;padding-top:40px;font-size:24px">
                                                    <div style="background-color:#ffffff;padding-top:0;padding-right:0;padding-bottom:20px;padding-left:0">
                                                        <div>
                                                            <a style="color:#009ac7;text-decoration:none" href="${url}" target="_blank">
                                                                <img src="${url}/assets/img/logo_light.png" style="vertical-align:middle;width:45%;height:auto;max-width:100%;border-width:0" alt="${appName}">
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding-left:20px;padding-right:20px">
                                    <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <h2 style="margin-top:2rem"><a href="${url}" target="_blank" style="text-decoration:none;">${appName}</a></h2>
                                                        <h3 class="suheader" style="margin-bottom:12px">Hi ${fname},</h3>
                                                        <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                            Welcome to ${appName}
                                                        </p>
                                                        <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                            You're welcome to ${appName} company with thousands of sellers and millions of products that use ${appName} everyday for their sales at the best market price.
                                                        </p>
                                                        <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                            <a href="${url}/auth/sign-in" style="background:#131415;color:#fff;font-size:14px;border:0;border-radius:4px;display:inline-block;line-height:24px;margin:8px 0;min-height:20px;outline:0;padding:8px 20px;text-align:center;vertical-align:middle;white-space:nowrap;text-decoration:none" target="_blank">
                                                                Sing In
                                                            </a>
                                                        </p>
                                        
                                                        <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                            ${appName} is an online and offline shop multi purpose application system.
                                                        </p>
                                        
                                                        <p>
                                                            <span style="line-height:24px;font-size:16px">Regards,</span><br>
                                                            <span style="line-height:24px;font-size:16px">The ${appName} Team</span>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr style="margin-top:1.5rem; margin-bottom:2rem;"/>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                        <tbody>
                            <tr>
                                <td align="center" style="padding-left:20px;padding-right:20px; boder-top:2px; color:red;">
                                    <table cellpadding="0" cellspacing="0" boder="0" align="center" style="width:520px;max-width:520px; margin:0 auto 0 auto; table-layout:fixed!important;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <p style="font-size:16px;margin-bottom:15px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                                                            Questions? Check out the <a href="/faqs">FAQs</a> or get help from <a href="/support">Support</a>.
                                                        </p>
                                        
                                                        <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                                                            This email was sent from a notification-only address. Please do not reply.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    <table>
                </div>
            `;
        return await this.emailData(fname, lname, email, html, subject);
    }

    async formatEmailValidationSender({ fname, lname, email, newToken, url, appName }, type, subject) {

        let html = '';
        if (type === 'register') {
            html = `
                <div>
                    <h3 class="suheader">Dear ${fname} ${lname}</h3>
                    <p class="title">Congratulations on your new account ${email}</p>
                    <div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
                        <section style="margin: 0 auto;text-align: center;">
                            <h3 style="font-family:'AvenirNext',Arial,sans-serif;font-size:25px;line-height:33px;color:#626262;letter-spacing:2px">${appName}</h3>
                            <p>Hi There.</p>
                            <p>Please <a href="${url}/auth/account-validate?tcv=${newToken}" target="_blank">confirm</a> your email address</p>
                            <a style="display: inline-block; text-decoration-line: none; font-size: 24px; background-color: #35ad9ac2; padding: 10px; border:0px; border-radius: 15px; color: #fff; margin: 10px 0 10px 0; cursor:pointer" href="${url}/auth/account-validate?tcv=${newToken}" target="_blank">Click me to confirm your account</a>
                            <p>Once your account is confirmed, you’ll be officially ready to login and enjoy our system</p>
                            <p >Thank you for using <a target="_blank" href="${url}"\>${appName}</a></p>
                        </section>
                    </div>
                </div>
            `;
        }
        //for register thanks
        if (type === 'thanks') {
            html = `
                <div>
                    <h2>${appName}</h2>
                    <h3 class="suheader">Dear ${fname} ${lname}</h3>
                    <p class="title">Congratulations on your new account ${email}</p>
                    <div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
                        <table>
                            <tr>
                                <td><h3 style="font-family:'AvenirNext',Arial,sans-serif;font-size:25px;line-height:33px;color:#626262;letter-spacing:2px">${appName} Welcome you</h3></td>
                            </tr>
                            <tr>
                                <td><p>Hey There.</p></td>
                            </tr>
                            <tr>
                                <td><p>Thank you for confirming your account!!!</p></td>
                            </tr>
                            <tr>
                                <td><a style="display: inline-block; text-decoration-line: none; font-size: 24px; background-color: #35ad9ac2; padding: 10px; border:0px; border-radius: 15px; color: #fff; margin: 10px 0 10px 0;" href="${url}/auth/sign-in" class="btn-register">Click here to login</a></td>
                            </tr>
                            <tr>
                                <td><p >Thank for using <a href="${url}" target="_blank"\>${appName}</a></p></td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                </div>`;
        }

        // <a href="${url}/auth/account-password-reset/${newToken}" style="background:#131415;color:#fff;font-size:14px;border:0;border-radius:4px;display:inline-block;line-height:24px;margin:8px 0;min-height:20px;outline:0;padding:8px 20px;text-align:center;vertical-align:middle;white-space:nowrap;text-decoration:none" target="_blank" data-saferedirecturl="">Reset my password</a>
        // <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
        //     Hi ${fname},
        // </p>

        //used
        if (type === 'recoveryAccount') {
            html = `
                <div style="padding:20px 50px 20px 50">
                    <h2>${appName}</h2>
                    <h3 class="suheader" style="margin-bottom:12px">Dear ${fname} ${lname}</h3>
                    <p style="font-size:16px;margin-bottom:24px;margin-top: -10px;line-height:24px;text-align:left;" class="title">
                        Password reset has been requested of your account ${email}. please follow the instructions bellow.
                    </p>

                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                        Your ${appName} password can be reset by clicking the button below. If you did not request a new password, please ignore this email.
                    </p>

                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                        <a href="${url}/auth/account-password-reset/${newToken}" style="background:#131415;color:#fff;font-size:14px;border:0;border-radius:4px;display:inline-block;line-height:24px;margin:8px 0;min-height:20px;outline:0;padding:8px 20px;text-align:center;vertical-align:middle;white-space:nowrap;text-decoration:none" target="_blank">Reset my password</a>
                    </p>

                    <p style="font-size:16px;margin-bottom:16px;line-height:24px;text-align:left;">
                        If you think this reset request looks suspicious, please let us know, we take our security seriously.
                    </p>

                    <p>
                        <span style="line-height:24px;font-size:16px">Regards,</span><br>
                        <span style="line-height:24px;font-size:16px">The ${appName} Team</span>
                    </p>
                </div>
            `;
        }




        if (type === 'requestedResetPassword') {
            html = `
                <div>
                    <h2>${appName}</h2>
                    <h3 class="suheader">Dear ${fname} ${lname}</h3>
                    <p class="title">You have requested reset, your password account ${email} please follow the instructions bellow</p>
                    <div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
                        <table>
                            <tr>
                                <td><h3 style="font-family:'AvenirNext',Arial,sans-serif;font-size:25px;line-height:33px;color:#626262;letter-spacing:2px">${appName}</h3></td>
                            </tr>
                            <tr>
                                <td><p>Hi ${fname},</p></td>
                            </tr>
                            <tr>
                                <td><p>Your ${appName} password can be reset by clicking the button below. If you did not request a new password, please ignore this email.</p></td>
                            </tr>
                            <tr>
                                <td><a style="display: inline-block; text-decoration-line: none; font-size: 24px; background-color: #35ad9ac2; padding: 10px; border:0px; border-radius: 15px; color: #fff; margin: 10px 0 10px 0;" href="${url}/auth/account-password-reset/${newToken}" class="btn-register">Reset my password</a></td>
                            </tr>
                            <tr>
                                <td><p >Thank for using <a href="${url}" target="_blank"\>${appName}</a></p></td>
                            </tr>
                            <tr>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <p class="title">You have requested reset, your password account ${email} please follow the instructions bellow</p>
                </div>
            `;
        }

        if (type === 'resetPassword') {
            html = html = `
            <div>
                <h2>${appName}</h2>
                <h3 class="suheader">Dear ${fname} ${lname}</h3>
                <div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
                    <p class="title">Congratulations your password account ${email} has been changed successfully</p>
                </div>
                <div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
                    <table>
                        <tr>
                            <td><h3 style="font-family:'AvenirNext',Arial,sans-serif;font-size:25px;line-height:33px;color:#626262;letter-spacing:2px">${appName} Welcome you</h3></td>
                        </tr>
                        <tr>
                            <td><p>Hey There.</p></td>
                        </tr>
                        <tr>
                            <td><p>Thank you for reset your password account!!!</p></td>
                        </tr>
                        <tr>
                            <td><a style="display: inline-block; text-decoration-line: none; font-size: 24px; background-color: #35ad9ac2; padding: 10px; border:0px; border-radius: 15px; color: #fff; margin: 10px 0 10px 0;" href="${url}/auth/sign-in" class="btn-register">Click here to login</a></td>
                        </tr>
                        <tr>
                            <td><p >Thank for using <a href="${url}" target="_blank"\>${appName}</a></p></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>`;
        }

        let emailData = {
            name: `${fname} ${lname}`,
            to: email,
            html: html,
            subject: subject,
        };
        return await this.main(emailData);
    }
}

// main().catch(console.error);
module.exports = NodeEmail;

/*
<div>
		<h3 class="suheader">Dear Jemaury Santana</h3>
		<p class="title">Congratulations on your new account jemaury@gmail.com</p>

		<div style="min-width: 100%; display: flex; flex-direction: row; justify-content: center; flex-basis: 100%; height: auto;">
			<section style="margin: 0 auto;text-align: center;">
				<h3 style="font-family:'AvenirNext',Arial,sans-serif;font-size:25px;line-height:33px;color:#626262;letter-spacing:2px">Welcome to Ansy Max Softaware Developer</h3>
				<p>Hi There.</p>
				<p>Please <a href="localhost:3901/auth/confirm/561dfd15f1d5f15df151df1df">confirm</a> your email address, or enter the confirmation code ‘271968’ in the Tile App.</p>
				<a style="display: inline-block; text-decoration-line: none; font-size: 24px; background-color: #35ad9ac2; padding: 10px; border:0px; border-radius: 15px; color: #fff; margin: 10px 0 10px 0;" href="localhost:3901/auth/confirm/561dfd15f1d5f15df151df1df" class="btn-register">Click me to confirm your account</a>
				<p >Thanks for use <a href="ansymax.com" \>ansy max software developer</a></p>
			</section>


		</div>

	</div>
*/
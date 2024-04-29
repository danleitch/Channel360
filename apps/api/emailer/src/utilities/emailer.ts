import {createTransport, getTestMessageUrl} from "nodemailer";
import handlebars from "handlebars";

export interface Options {
    toAddress: string,
    subject:string,
    text: string,
}

export abstract class Emailer {
    private transporter: any;
    abstract replacements: any;
    abstract options: Options;

    constructor(private html: any) {
        this.transporter = this.buildTransport()
    }

    private buildTransport() {
        return createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "apikey",
                pass: process.env.SENDGRID_API_KEY,
            },
        });
    }

    public async send() {
        const template = handlebars.compile(this.html);
        const htmlToSend = template(this.replacements);

        const mailOptions = {
            from: "noreply@channelmobile.co.za",
            html: htmlToSend,
            ...this.options,
            to:this.options.toAddress
        };

        let info = await this.transporter.sendMail(mailOptions);
        console.log("Preview URL: %s", getTestMessageUrl(info));
    }
}
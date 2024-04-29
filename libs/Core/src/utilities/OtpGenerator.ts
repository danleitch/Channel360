export class OTPGenerator {
    private readonly charset: string;
    private readonly length: number;

    constructor(length: number = 6) {
        this.charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Alphanumeric characters
        this.length = length;
    }

    generateOTP(): string {
        let otp = '';
        for (let i = 0; i < this.length; i++) {
            const randomIndex = Math.floor(Math.random() * this.charset.length);
            otp += this.charset.charAt(randomIndex);
        }
        return otp;
    }
}
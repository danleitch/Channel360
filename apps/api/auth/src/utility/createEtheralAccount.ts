import nodemailer from 'nodemailer'

export const createEtherealAccount = async () => {
	const testAccount = await nodemailer.createTestAccount()
	return {
		email: testAccount.user,
		password: testAccount.pass,
	}
}

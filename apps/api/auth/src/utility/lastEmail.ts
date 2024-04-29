import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

const connectToMailbox = async (username: string, password: string) => {
	// Replace these with the Ethereal SMTP server details obtained while creating the account.
	const client = new ImapFlow({
		host: 'imap.ethereal.email',
		port: 993,
		secure: true,
		auth: {
			user: username, // Ethereal username
			pass: password, // Ethereal password
		},
	})

	await client.connect() // Connect to the mailbox
	return client
}

// Function to fetch the last email from the INBOX mailbox.
const fetchLastEmail = async (client: any) => {
	let lock
	let message

	try {
		lock = await client.getMailboxLock('INBOX') // Acquire the mailbox lock
		message = await client.fetchOne(client.mailbox.exists, { source: true }) // Fetch the last email
	} finally {
		if (lock) {
			await lock.release() // Release the mailbox lock
		}
	}

	return message
}

// Function to parse the email content.
const parseEmail = async (source: any) => {
	const parsedEmail = await simpleParser(source)

	// Extract the necessary information from the parsed email
	return {
		subject: parsedEmail.subject,
		text: parsedEmail.text,
		html: parsedEmail.html,
		attachments: parsedEmail.attachments,
	}
}

// Function to retrieve the last received email from the mailbox.
export const lastEmail = async (username: string, password: string) => {
	try {
		const client = await connectToMailbox(username, password)
		const message = await fetchLastEmail(client)

		if (!message) {
			throw new Error('No message found')
		}

		const source = Buffer.from(message.source)
		const parsedData = await parseEmail(source)

		await client.logout()

		return parsedData // Return the parsed email data
	} catch (error) {
		console.log('Error:', error)
		throw error
	}
}

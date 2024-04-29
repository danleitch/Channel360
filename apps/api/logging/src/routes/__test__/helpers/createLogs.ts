import { Log, LogDoc } from '@models/log'

// Log creation function.
export const createLogs = async (
	organization: string,
	messageText: string
): Promise<LogDoc> => {
	return Log.build({
		mobileNumber: '083551228',
		conversationId: 'conversationIdExample',
		messageText: messageText,
		direction: 'inboundExample',
		status: 'successExample',
		organization: organization,
	})
}

import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { calculateSecretHash } from "./calculateSecretHash";

/**
 * @class CognitoAPIProvider
 * @description - Abstract class for Cognito API Provider
 * @param userId - must provide to constructor if you want to use SECRET_HASH
 */
export abstract class CognitoAPIProvider {
  protected cognitoIdentityServiceProvider: CognitoIdentityServiceProvider

  abstract PARAMS: any

  public SECRET_HASH: string

  protected constructor(userId?: string) {
    this.SECRET_HASH = calculateSecretHash(
      {
        clientSecret: process.env['AWS_COGNITO_CLIENT_SECRET']!,
        clientId: process.env['AWS_COGNITO_CLIENT_ID']!,
      },
      userId || ''
    )
    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider()
  }
}
import { CognitoAPIProvider } from "@channel360/core";

export class CreateGroupController extends CognitoAPIProvider {
  constructor(private groupName: string, private description: string) {
    super();
  }

  PARAMS = {
    GroupName: this.groupName,
    Description: this.description,
    UserPoolId: process.env["AWS_COGNITO_POOL_ID"]!,
  };

  async createGroup(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.createGroup(
        this.PARAMS,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}

export class AssignGroupController extends CognitoAPIProvider {
  constructor(private cognitoId: string, private groupName: string) {
    super();
  }

  PARAMS = {
    UserPoolId: process.env["AWS_COGNITO_POOL_ID"]!,
    Username: this.cognitoId,
    GroupName: this.groupName,
  };

  public async assignUserToGroup(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.adminAddUserToGroup(
        this.PARAMS,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}

export class UnassignGroupController extends CognitoAPIProvider {
  constructor(private cognitoId: string, private groupName: string) {
    super();
  }

  PARAMS = {
    UserPoolId: process.env["AWS_COGNITO_POOL_ID"]!,
    Username: this.cognitoId,
    GroupName: this.groupName,
  };

  public async unassignUserToGroup(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cognitoIdentityServiceProvider.adminRemoveUserFromGroup(
        this.PARAMS,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }
}

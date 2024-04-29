// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  status?: string;
  loading: boolean;
  user: AuthUserType;
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (
    newPassword: string,
    code: string,

    email: string
  ) => Promise<void>;
  resendCodeRegister?: (email: string) => Promise<void>;
  newPassword?: (email: string, code: string, password: string) => Promise<void>;
};

export type AuthTypes = {
  user: AuthUserType;
  login?: (email: string, password: string) => Promise<void>;
  loading: boolean;
  method: string;
  authenticated: boolean;
  unauthenticated: boolean;
  logout: () => Promise<void>;
  register?: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    mobileNumber: string
  ) => Promise<void>;
  verify?: (email: string, code: string) => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (
    newPassword: string,
    code: string,

    email: string
  ) => Promise<void>;
  resendOtp?: (email: string) => Promise<void>;
  newPassword?: (email: string, code: string, password: string) => Promise<void>;
};

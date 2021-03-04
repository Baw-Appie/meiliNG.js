import { TemplateLanguage } from '../../../../common/notification';

export enum MeilingV1SigninType {
  USERNAME_CHECK = 'username_check',
  USERNAME_AND_PASSWORD = 'username_and_password',
  TWO_FACTOR_AUTH = 'two_factor_authentication',
  PASSWORDLESS = 'passwordless',
}

export enum MeilingV1ExtendedAuthMethods {
  PGP_SIGNATURE = 'pgp_signature',
  OTP = 'otp',
  SMS = 'sms',
  EMAIL = 'email',
  SECURITY_KEY = 'security_key',
}

export type MeilingV1SignInBody =
  | MeilingV1SignInUsernameCheck
  | MeilingV1SignInUsernameAndPassword
  | MeilingV1SignInExtendedAuthentication;

export interface MeilingV1SignInUsernameCheck {
  type: MeilingV1SigninType.USERNAME_CHECK;
  data: {
    username: string;
  };
}

export interface MeilingV1SignInUsernameAndPassword {
  type: MeilingV1SigninType.USERNAME_AND_PASSWORD;
  data: {
    username: string;
    password: string;
  };
}

export type MeilingV1SignInExtendedAuthentication = MeilingV1SignInTwoFactor | MeilingV1SignInPasswordLess;

export interface MeilingV1PasswordReset {
  method?: MeilingV1ExtendedAuthMethods;
  data?: MeilingV1SignInAuthenticateData;
  context?: {
    username?: string;
    phone?: string;
    lang?: TemplateLanguage;
  };
}

export interface MeilingV1SignInTwoFactor {
  type: MeilingV1SigninType.TWO_FACTOR_AUTH;
  data?: MeilingV1SignInAuthenticateData;
}

interface MeilingV1SignInPasswordLess {
  type: MeilingV1SigninType.PASSWORDLESS;
  data?: MeilingV1SignInAuthenticateData;
  context?: {
    username?: string;
    phone?: string;
  };
}

interface MeilingV1SignInAuthenticateData {
  method?: MeilingV1ExtendedAuthMethods;
  challengeResponse?: string;
  challengeContext?: any;
}

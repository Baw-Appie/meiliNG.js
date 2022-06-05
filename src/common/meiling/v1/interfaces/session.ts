import { ExtendedAuthMethods, SigninType } from './query';

export interface MeilingSession {
  user?: LoggedInUser[];
  extendedAuthentication?: ExtendedAuthentication;
  previouslyLoggedIn?: LoggedInUser[];
  authenticationStatus?: SessionAuthenticationStatus;
  passwordReset?: SessionPasswordReset;
  registering?: SessionRegistering;
}

export interface SessionRegistering {
  webAuthn?: RegisteringWebAuthn;
  otp?: RegisteringOTP;
}

export interface RegisteringWebAuthn {
  challenge: string;
}

export interface RegisteringOTP {
  secret: string;
  issuedAt: number;
}

export interface LoggedInUser {
  id: string;
}

export interface SessionPasswordReset extends SessionChallengeBody {
  method?: ExtendedAuthMethods;
  passwordResetUser?: string;
  isVerified?: boolean;
}

interface SessionTwoFactor extends SessionChallengeBody {
  id: string;
  type: SigninType.TWO_FACTOR_AUTH;
  method?: ExtendedAuthMethods;
}

interface SessionPasswordLess extends SessionChallengeBody {
  type: SigninType.PASSWORDLESS;
  method?: ExtendedAuthMethods;
}

interface SessionChallengeBody {
  challenge?: string;
  challengeCreatedAt?: Date;
}

interface SessionChallengeStatus<T> {
  to: T;
  challenge: SessionChallengeBody;
  isVerified: boolean;
}

export interface SessionAuthenticationStatus {
  email?: SessionChallengeStatus<string>;
  phone?: SessionChallengeStatus<string>;
}

export type ExtendedAuthentication = SessionPasswordLess | SessionTwoFactor;

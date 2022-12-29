export class ErrorMessages {
  // redis
  static errorSettingRedisValue = (value: string, location: string) =>
    `Error trying to set ${value} at ${location} in redis.`;

  // Auth items
  static unknownAuthenticator =
    "Error signing in. Try again later or create an account first.";
  static userDeclinedRegistrationOrTimeout =
    "User Declined Registration or took too long";
  static webAuthnTimeOutOrCancel =
    "User clicked cancel, or the authentication ceremony timed out";
  static maxUsernameLength = "username should be less than 64 characters";
  static somethingWentWrong =
    "Something Went Wrong. Please try again in a bit!";
  static userDoesNotExists = "The user you are querying for does not exists";

  // Gas refund stuff
  static invalidAccessCode =
    "The access code that you entered is invalid. Please try again with another code";
  static accessCodeAlreadyUsed =
    "The access code has already been redeemed. If you're wondering about the status of the transition, fret not! We'll be in touch within a week or so at the email you gave to update you.";

  // smart contract wallets
  static defaultSmartContractWalletAlreadyExists =
    "Default smart contract wallet already exists";
  static tooManyDefaultSmartContractWallets =
    "Too many default smart contract wallets";
  static invalidWalletAddress = "Invalid wallet address given";
}

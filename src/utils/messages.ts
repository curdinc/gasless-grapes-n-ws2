export class ErrorMessages {
  // Auth items
  static userTookTooLong = "The reservation on the user handle expired";
  static userAlreadyExists =
    "The user with the user handle or email is already taken. Please choose another one";
  static unknownAuthenticator =
    "Error signing in. Try again later or create an account first.";
  static authenticatorAlreadyKnown =
    "The device is already registered to an account. Sign in instead";
  static userDeclinedRegistrationOrTimeout =
    "User Declined Registration or took too long";

  static webAuthn = {
    timeoutOrCancel:
      "User clicked cancel, or the authentication ceremony timed out",
  };

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

  // redis
  static errorSettingRedisValue = (value: string, location: string) =>
    `Error trying to set value:${value} while executing: ${location} in redis.`;
  static errorFindingRedisValue = (key: string) =>
    `Error finding key:${key} in redis.`;
  // DB
  static fieldAlreadyExists = (field: string) =>
    `The ${field} given already exists. Please try again with another one.`;
  static prisma = {
    fieldAlreadyExists: `Unique constraint failed on the fields: (\``,
  };
}

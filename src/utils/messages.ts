export class ErrorMessages {
  static userDeclinedRegistrationOrTimeout =
    "User Declined Registration or took too long";
  static webAuthnTimeOutOrCancel =
    "User clicked cancel, or the authentication ceremony timed out";
  static maxUsernameLength = "username should be less than 64 characters";
  static somethingWentWrong =
    "Something Went Wrong. Please try again in a bit!";

  // Gas refund stuff
  static invalidAccessCode =
    "The access code that you entered is invalid. Please try again with another code";
  static accessCodeAlreadyUsed =
    "The access code has already been redeemed. If you're wondering about the status of the transition, fret not! We'll be in touch within a week or so at the email you gave to update you.";
}

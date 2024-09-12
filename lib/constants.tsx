//-----------------------------------SIGN(UP/IN/OUT) MESSAGES-----------------------------------

// -*-*-*-*-*-*-*-*-* SUCCESS -*-*-*-*-*-*-*-*-*-*-*
export const SUCCESS_TITLE = 'Success';
export const LOGOUT_DISC = 'Logged out!';
export const SUCCESS_SIGNUP_DESC = 'Hop on Matey!';
export const SUCCESS_LOGIN_MESSAGE = 'Welcome back!';
// -*-*-*-*-*-*-*-*-* FAILURE -*-*-*-*-*-*-*-*-*-*-*
export const ERROR_TITLE = 'Error';
export const NO_MATCHES_FOUND = 'No matches found'
export const DEFAULT_ERROR_MESSAGE = 'An error occurred';
export const ERROR_CREATING_USER = 'Error creating user:';
export const SIGN_UP_VERIFICATION_FAILED = 'Verification failed';
export const TWO_OR_MORE_ERRORS = 'Multiple errors or an unexpected error occurred'
export const FAILED_CREATING_USER = 'Failed to create user in database. Please try again.'
// ------------------------------------- ROUTES -------------------------------------
export const MAIN_ROUTE = '/';
export const MATCH_ROUTE = '/match';
export const PROFILE_ROUTE = '/profile';
export const AUTH_SIGN_UP_ROUTE = '/auth/sign-up';
export const AUTH_SIGN_IN_ROUTE = '/auth/sign-in';
// ------------------------------------- BUTTONS & FORM FIELDS ------------------------------
export const FORM_OTP = 'OTP';
export const NAV_FEED = 'Feed';
export const NAV_MATCH = 'Match';
export const FORM_EMAIL = 'Email';
export const NAV_PROFILE = 'Profile';
export const ENTER_OTP = 'Enter OTP';
export const VERIFY_BUTTON = 'Verify';
export const SIGN_UP_BUTTON = 'Sign Up';
export const SIGN_IN_BUTTON = 'Sign In';
export const FORM_PASSWORD = 'Password';
export const SIGN_UP_HEADING = 'Sign Up';
export const SIGN_OUT_BUTTON = 'Sign Out';
export const FIRST_NAME = 'First Name';
export const LAST_NAME = 'Last Name';
export const DOB = 'Date of Birth';
export const GENDER = 'Gender';
export const MALE = 'Male';
export const FEMALE = 'Female';
export const PREFERENCE = 'Preference';
// ------------------------------------- MISC ------------------------------
export const COMPLETE = 'complete';
export const NEXT = 'Next';
//-------------------------------------SCHEMA RELATED-----------------------
export const PASS_MIN = 8;
export const PASS_MAX = 64;
export const INVALID_EMAIL = 'Invalid email';
export const REQ_OTP_ERR = 'OTP is required';
export const REQ_GENDER_ERR = 'Gender is required';
export const REQ_LNAME_ERR = 'Last name is required';
export const REQ_PREF_ERR = 'Preference is required';
export const REQ_FNAME_ERR = 'First name is required';
export const PASS_MIN_ERR = 'Password must be at least 8 characters';
export const PASS_MAX_ERR = 'Password cannot be longer than 64 characters';
// ----------------------------------MATCH FEATURE REALTED -------------------------
export const MATCH_ALERT = "It's a match!";
export const MATCH_DESC = "You both liked each other!";
// ----------------------------------FEED FEATURE REALTED -------------------------
export const FEED_NO_USER = 'users for now, come back later.';
// ----------------------------------LOGIC-----------------------------------
export const MIN_ALLOWED_DATE = new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
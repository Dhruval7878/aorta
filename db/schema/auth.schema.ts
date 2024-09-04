import { z } from "zod";
import { INVALID_EMAIL, PASS_MAX, PASS_MAX_ERR, PASS_MIN, PASS_MIN_ERR, REQ_FNAME_ERR, REQ_GENDER_ERR, REQ_LNAME_ERR, REQ_OTP_ERR, REQ_PREF_ERR } from "../../lib/constants";

export const UserLoginSchema = z.object({
  email: z.string().email({ message: INVALID_EMAIL }),
  password: z.string()
    .min(PASS_MIN, { message: PASS_MIN_ERR })
    .max(PASS_MAX, { message: PASS_MAX_ERR }),
});

export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['0', '1']),
  preference: z.enum(['0', '1']),
  dob: z.string({ message: 'Date of birth is required' })
});

export const CredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export const OtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 characters long')
});

export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>;
export type CredentialsData = z.infer<typeof CredentialsSchema>;
export type OtpData = z.infer<typeof OtpSchema>;
export type SignInFormData = z.infer<typeof UserLoginSchema>;
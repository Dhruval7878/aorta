import { SIGN_UP_HEADING } from '@/lib/constants';
import MultiStepRegistrationForm from './MultiStepRegistrationForm';

export default function SignUpPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{SIGN_UP_HEADING}</h1>
      <MultiStepRegistrationForm />
    </div>
  );
}
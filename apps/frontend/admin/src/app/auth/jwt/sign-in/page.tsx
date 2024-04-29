import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Sign In',
};

export default function SigninPage() {
  return <JwtLoginView />;
}

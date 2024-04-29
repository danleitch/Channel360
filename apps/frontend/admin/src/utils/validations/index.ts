import * as Yup from 'yup';

const standardErrorMessage = 'Field is required';

// A reusable text schema
const textSchema = Yup.string().required(standardErrorMessage);

const mobileNumberRegex = /^\+27[ -]?\d{9}$/;
const codeRegex = /^\d{6}$/;
const passwordRegex = {
  upper: /[A-Z]/,
  number: /\d/,
};

// Regex patterns

const createOrganization = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  planId: Yup.string().required('Plan is required'),
});

const email = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
});

const resetPassword = Yup.object().shape({
  code: Yup.string()
    .required('Code is a required field')
    .matches(codeRegex, 'Check your email for the code.'),
  newPassword: Yup.string()
    .required('Password is a required field')
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordRegex.upper, 'Password must contain at least one uppercase letter')
    .matches(passwordRegex.number, 'Password must contain at least one number'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is a required field'),
});

const signUp = Yup.object().shape({
  firstName: textSchema,
  lastName: textSchema,
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  password: Yup.string().required('Password is required'),
  mobileNumber: Yup.string()
    .matches(
      mobileNumberRegex,
      'Please enter a valid mobile number, including the country code (e.g., +27 for South Africa).'
    )
    .required('Mobile number is required. Please include the country code.'),
});

const logIn = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  password: Yup.string().required('Password is required'),
});

const user = Yup.object().shape({
  user: Yup.string().required('User is required'),
});

const appId = Yup.object().shape({
  appId: Yup.string().required('App ID is required'),
});

const validationSchemas = {
  createOrganization,
  email,
  resetPassword,
  signUp,
  logIn,
  user,
  appId,
};

export default validationSchemas;

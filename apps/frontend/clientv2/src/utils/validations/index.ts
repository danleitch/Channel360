import * as Yup from 'yup';

const standardErrorMessage = 'Field is required';

// A reusable text schema
const textSchema = Yup.string().required(standardErrorMessage);

const textSchema2 = Yup.object().shape({
  text: Yup.string().required(standardErrorMessage),
});

// Regex patterns
const mobileNumberRegex = /^\+\d{8,}$/;

const codeRegex = /^\d{6}$/;
const passwordRegex = {
  upper: /(?=.*[A-Z])/,
  number: /(?=.*\d)/,
  // eslint-disable-next-line no-useless-escape
  special: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/])/,
};

const hasParams = (str: string | undefined) => {
  if (str === undefined) {
    return false;
  }
  return /{{([1-9])}}/g.test(str);
};

// Schema templates
const fileType = Yup.mixed().test(
  'fileType',
  standardErrorMessage,
  (value: any) => !(!value || !value[0])
);

const createCampaign = (template: any) =>
  Yup.object().shape({
    reference: Yup.string().required(standardErrorMessage),
    subscriberGroup: Yup.string().required(standardErrorMessage),
    template: Yup.string().required(standardErrorMessage),
    onCreationTag: Yup.array().of(textSchema2).required(),
    csvTags: Yup.array().of(textSchema2).required(),
    file: template?.components?.some(
      (component: { type: string; format: string }) =>
        component.type === 'HEADER' && component.format === 'DOCUMENT'
    )
      ? fileType
      : Yup.string(),
    csvFile: Yup.mixed().when('csvTags', {
      is: (csvTags: string | any[]) => csvTags && csvTags.length > 0,
      then: fileType.required(standardErrorMessage),
      otherwise: Yup.mixed().notRequired(),
    }),
  });

const notification = (template: any) =>
  Yup.object().shape({
    onCreationTag: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string().required(standardErrorMessage),
        })
      )
      .required(),
    file: template?.components?.some(
      (component: { type: string; format: string }) =>
        component.type === 'HEADER' && component.format === 'DOCUMENT'
    )
      ? fileType
      : Yup.string(),
    template: Yup.string().required(standardErrorMessage),
  });

const deleteCampaign = Yup.object().shape({
  campaignId: textSchema,
});

const template: any = {
  category: textSchema,
  name: Yup.string()
    .required(standardErrorMessage)
    .matches(
      /^[a-z0-9_](?!.*?[^a-z0-9_]).*?[a-z0-9]$/,
      'Use only lowercase letters, numbers and underscores'
    ),
  description: textSchema,
  language: textSchema,
  header: Yup.string(),
  header_text: Yup.string()
    .max(60, 'Must be under 60 characters')
    .test(
      'noParamsInBoth',
      'Params can be in either header or body, but not both',
      function headerTextTestFunction(value) {
        const { body } = this.parent;

        if (hasParams(value) && hasParams(body)) {
          return false;
        }
        return true;
      }
    )
    .when('header', { is: 'TEXT', then: textSchema }),
  header_document: Yup.mixed().when('header', {
    is: 'DOCUMENT',
    then: Yup.mixed().test('fileType', standardErrorMessage, (value) => {
      if (!value || !value[0]) {
        return false;
      }
      return true;
    }),
  }),
  header_image: Yup.mixed().when('header', {
    is: 'IMAGE',
    then: Yup.mixed().test('fileType', standardErrorMessage, (value) => {
      if (!value || !value[0]) {
        return false;
      }
      return true;
    }),
  }),
  header_video: Yup.mixed().when('header', {
    is: 'VIDEO',
    then: Yup.mixed()
      .required(standardErrorMessage)
      .test(
        'fileType',
        'File can only be MP4',
        (value) => !(!value || !value[0] || value[0].type !== 'video/mp4')
      )
      .test(
        'fileSize',
        'File size cannot be above 15MB',
        (value) => !(value && value[0] && value[0].size > 15 * 1000 * 1000)
      ),
  }),
  body: Yup.string()
    .max(1024, 'Cannot exceed 1024 characters')
    .required(standardErrorMessage)
    .test(
      'noParamsInBoth',
      'Params must be in either header or body, but not both',
      function bodyTextTestFunction(value) {
        const { header_text } = this.parent;
        if (hasParams(value) && hasParams(header_text)) {
          return false;
        }
        return true;
      }
    ),
  footer: Yup.string().max(60, 'Must be under 60 characters'),
  buttons: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().max(25, 'Cannot exceed 25 characters').required(standardErrorMessage),
        phoneNumber: Yup.string().when('type', {
          is: 'PHONE_NUMBER',
          then: Yup.string()
            .matches(
              /^\+27[ -]?\d{9}$/,
              'Phone number must be a valid number, remember the country code'
            )
            .required(standardErrorMessage),
        }),
        url: Yup.string().when('type', {
          is: 'URL',
          then: Yup.string()

            .matches(
              // eslint-disable-next-line no-useless-escape
              /^(https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)(\?[\s\S]*?(\{\{1\}\})?)?$/,

              'Please enter a valid URL'
            )
            .required(standardErrorMessage),
        }),
        example: Yup.array()
          .of(Yup.string().required(standardErrorMessage))
          .when('url', (url, schema) =>
            url?.endsWith('{{1}}') ? schema : Yup.array().notRequired()
          ),
      })
    )
    .required(standardErrorMessage),
};

const tag = Yup.object().shape({
  index: Yup.string().when('content_type', {
    is: 'buttons',
    then: Yup.string().notRequired(), // Not required if content_type is 'buttons'
    otherwise: Yup.string().required('Index is required'), // Required for other content types
  }),
  content_type: textSchema,
  tag_type: textSchema,
  tag_field: Yup.string().when('tag_type', {
    is: (tagType: string) => tagType !== 'subscriber-field',
    then: textSchema,
  }),
  subscriber_field: Yup.string().when('tag_type', {
    is: 'subscriber-field',
    then: textSchema,
  }),
});

const editTag = Yup.object().shape({
  tag_type: textSchema,
  tag_field: Yup.string().when('tag_type', {
    is: (tagType: string) => tagType !== 'subscriber-field',
    then: textSchema,
  }),
  subscriber_field: Yup.string().when('tag_type', {
    is: 'subscriber-field',
    then: textSchema,
  }),
});

const createGroup = Yup.object().shape({
  name: Yup.string().required('Group name is required'),
  description: Yup.string().required('Group description is required'),
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
  mobileNumber: Yup.string()
    .matches(
      mobileNumberRegex,
      'Please enter a valid mobile number, including the country code (e.g., +27 for South Africa).'
    )
    .required('Mobile number is required. Please include the country code.'),
  password: Yup.string()
    .required('Password is a required field')
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordRegex.upper, 'Password must contain at least one uppercase letter')
    .matches(passwordRegex.number, 'Password must contain at least one number')
    .matches(passwordRegex.special, 'Password must contain at least one symbol character'),
});

const logIn = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  password: Yup.string().required('Password is required'),
});

const subscriber = Yup.object().shape({
  mobileNumber: Yup.string()
    .matches(mobileNumberRegex, 'Phone number is not valid')
    .required(standardErrorMessage),
  firstName: textSchema,
  lastName: textSchema,
});

const videoFile = Yup.object().shape({
  file: Yup.mixed()
    .required('File is required')
    .test(
      'fileType',
      'File can only be MP4',
      (value) => !(!value || !value[0] || value[0].type !== 'video/mp4')
    )
    .test(
      'fileSize',
      'File size should not exceed 15MB',
      (value) => value && value[0].size <= 15 * 1024 * 1024 // 15MB
    ),
});

const addSubscriber = Yup.object().shape({
  mobileNumber: Yup.string()
    .matches(mobileNumberRegex, 'Phone number is not valid')
    .required(standardErrorMessage),
  firstName: textSchema,
  lastName: textSchema,
});

const group = Yup.object().shape({
  group: Yup.string().required(),
});

const optInOptOut = Yup.object().shape({
  optInMessage: Yup.string()
    .required(standardErrorMessage)
    .max(75, 'Must be 75 characters or less.')
    .nullable(true),
  optOutMessage: Yup.string()
    .required(standardErrorMessage)
    .max(75, 'Must be 75 characters or less.')
    .nullable(true),
});

const validationSchemas = {
  addSubscriber,
  createCampaign,
  createGroup,
  deleteCampaign,
  email,
  videoFile,
  group,
  logIn,
  resetPassword,
  signUp,
  subscriber,
  template,
  editTag,
  tag,
  optInOptOut,
  notification,
};

export default validationSchemas;

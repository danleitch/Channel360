import dayjs from "dayjs";
import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  RHFSelect,
  RHFTextField,
  FormProvider,
  RHFUploadFile,
  RHFRadioButton,
  TemplateButtons,
  RHFDateTimePicker,
} from "./index";

export default {
  title: "React Hook Form",
  component: RHFTextField,
};

const Template = (args) => {
  const errorMessage = "whatever";
  const Schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    plan: Yup.string().required("Plan is required"),
    buttons: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string()
            .max(25, "Cannot exceed 25 characters")
            .required(errorMessage),
          phoneNumber: Yup.string().when("type", {
            is: "PHONE_NUMBER",
            then: Yup.string()
              .matches(
                /^\+27[ -]?\d{9}$/,
                "Phone number must be a valid number, remember the country code"
              )
              .required(errorMessage),
          }),
          url: Yup.string().when("type", {
            is: "URL",
            then: Yup.string()
              .url("Please enter a valid url")
              .required(errorMessage),
          }),
        })
      )
      .required(),
  });

  const methods = useForm({
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} justifyContent="center">
        <RHFTextField {...args} name="email" label="Email address" />
        <RHFSelect
          {...args}
          options={options}
          name="plan"
          label="Plan"
          valueKey="id"
          labelKey="title"
        />
        <RHFUploadFile name="file" fileType=".mp4" />
        <RHFDateTimePicker
          defaultValue={dayjs("2024-01-01T12:00:00")}
          name="startDate"
          label="Start Date"
        />
        <RHFRadioButton
          name="items"
          list={[
            "CSV",
            "ON_CAMPAIGN_CREATION",
            "SUBSCRIBER_FIELD",
            "HARD_CODED",
          ]}
        />
        <TemplateButtons />
        <LoadingButton type="submit" variant="contained">
          Submit
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export const Default = Template.bind({});

const options = [
  {
    includes: [
      "100+ users included",
      "1TB GB of storage",
      "Help center access",
    ],
    title: "Premium",
    term: "monthly",
    description: "Most popular",
    price: 200,
    createdAt: "2022-12-12T10:14:55.597Z",
    updatedAt: "2022-12-12T10:14:55.597Z",
    version: 0,
    id: "6396ff1f94014e001adfb3ca",
  },
  {
    includes: [
      "100+ users included",
      "1TB GB of storage",
      "Help center access",
    ],
    title: "Basic",
    term: "monthly",
    description: "Most popular",
    price: 200,
    createdAt: "2022-12-12T10:14:55.597Z",
    updatedAt: "2022-12-12T10:14:55.597Z",
    version: 0,
    id: "6396ff1f94014e001adfb2ca",
  },
  {
    includes: [
      "100+ users included",
      "1TB GB of storage",
      "Help center access",
    ],
    title: "Extra",
    term: "monthly",
    description: "Most popular",
    price: 200,
    createdAt: "2022-12-12T10:14:55.597Z",
    updatedAt: "2022-12-12T10:14:55.597Z",
    version: 0,
    id: "6396ff1f9e014e001adfb2ca",
  },
  {
    includes: [
      "100+ users included",
      "1TB GB of storage",
      "Help center access",
    ],
    title: "Bonus",
    term: "monthly",
    description: "Most popular",
    price: 200,
    createdAt: "2022-12-12T10:14:55.597Z",
    updatedAt: "2022-12-12T10:14:55.597Z",
    version: 0,
    id: "6396ff1f94016e001adfb2ca",
  },
  {
    includes: [
      "100+ users included",
      "1TB GB of storage",
      "Help center access",
    ],
    title: "Bespoke",
    term: "monthly",
    description: "Most popular",
    price: 200,
    createdAt: "2022-12-12T10:14:55.597Z",
    updatedAt: "2022-12-12T10:14:55.597Z",
    version: 0,
    id: "639gff1f94014e001adfb2ca",
  },
  {
    includes: [
      "100+ users included",
      "1TB GB of storage",
      "Help center access",
    ],
    title: "Minimal",
    term: "monthly",
    description: "Most popular",
    price: 200,
    createdAt: "2022-12-12T10:14:55.597Z",
    updatedAt: "2022-12-12T10:14:55.597Z",
    version: 0,
    id: "63qgff1f94014e001adfb2ca",
  },
];

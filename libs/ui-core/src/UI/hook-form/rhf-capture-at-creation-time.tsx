import React, { useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { TextField } from "@mui/material";

import { RHFUploadFile } from "./rhf-upload-file";
import { appendOnCreationTagsToFieldsArray } from "../helper/functions";

interface CapturedAtCreationTimeFieldsProps {
  template: any;
}

export interface TemplateType {
  tags: {
    buttons: Tags[];
    body: Tags[];
    head: Tags[];
  };
}

export interface Tags {
  type: string;
  value?: string;
  text: string;
  fields?: string;
}

interface RHFRenderTextFieldProps {
  index: number;
  name: string;
  label: string;
  helperText?: string;
  other?: any;
}

const RenderTextField: React.FC<RHFRenderTextFieldProps> = ({
  index,
  name,
  label,
  helperText,
  other,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={`${name}.${index}.text`}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          data-cy={`onCampaign__${label}`}
          label={label}
          name={`${name}.${index}.text`}
          id={name}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
};

export const RHFCapturedAtCreationTimeFields: React.FC<
  CapturedAtCreationTimeFieldsProps
> = ({ template }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "onCreationTag",
  });

  const {
    fields: csvFields,
    append: csvAppend,
    remove: csvRemove,
  } = useFieldArray({
    control,
    name: "csvTags",
  });

  useEffect(() => {
    if (template?.tags) {
      remove();
      csvRemove();
      const tags: Tags[] = [
        ...(template.tags.body ?? []),
        ...(template.tags.head ?? []),
        ...(template.tags.buttons ?? []),
      ];
      appendOnCreationTagsToFieldsArray(tags, append, "on-campaign-creation");
      appendOnCreationTagsToFieldsArray(tags, csvAppend, "csv");
    }
  }, [template]);

  const tags: Tags[] = [
    ...(template?.tags?.body ?? []),
    ...(template?.tags?.head ?? []),
    ...(template?.tags?.buttons ?? []),
  ];
  const onCreationTags = tags.filter(
    (tag) => tag.type === "on-campaign-creation"
  );
  const csvTags = tags.filter((tag) => tag.type === "csv");

  return (
    <>
      {csvFields.length > 0 ? (
        <RHFUploadFile name="csvFile" fileType=".csv" />
      ) : null}
      {fields.map((item, index) => (
        <RenderTextField
          key={`${item.id}-onCreationTag`}
          index={index}
          name="onCreationTag"
          label={onCreationTags[index]?.value || ""}
        />
      ))}
      {csvFields.map((item, index) => (
        <RenderTextField
          key={`${item.id}-csvTags`}
          index={index}
          name="csvTags"
          label={csvTags[index]?.fields || ""}
        />
      ))}
    </>
  );
};

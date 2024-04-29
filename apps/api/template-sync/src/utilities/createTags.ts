export const flattenObject = (
  obj: Record<string, unknown>
): Record<string, unknown> =>
  Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([iKey, iValue]) => {
        acc[`${iKey}`] = iValue;
      });
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

export const createTags = (components: any) => {

  const defaultTagType = "hard-coded";
  const defaultText = "TAG";
  const parameterRegex = new RegExp(/{{(.*?)}}/, "g");

  //only check components with replaceable text
  const componentsWithText = components.filter((item: any) =>
    !!item.text
  );

  const formattedTags = componentsWithText
    .map((item: any) => {
      const params = item.text.match(parameterRegex);
      if (params) {
        let tagType = "";
        const indexedParams = params.map((_element: any, index: any) => {
          return {index: index + 1, type: defaultTagType, value: defaultText};
        });

        switch (item.type) {
          case "HEADER":
            tagType = "head";
            break;
          case "BODY":
            tagType = "body";
            break;
        }

        return {[tagType]: indexedParams};
      }
      return;
    })
    .filter((item: any) => {
      return !!item;
    });

  return flattenObject(formattedTags);
};
export interface Component {
  type: string;
  text?: string | undefined;
  format?: string | undefined;
  buttons?:
    | [
        {
          type?: string | undefined;
          phoneNumber?: string | undefined;
          url?: string | undefined;
        }
      ]
    | undefined;
  parameters?:
    | [
        {
          type: string;
          text?: string;
          image?: {
            link: string;
          };
          document?: {
            link: string;
            filename: string;
          };
        }
      ]
    | undefined;
}

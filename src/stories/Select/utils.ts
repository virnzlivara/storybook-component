
export const sampleCode = (code: string = "") => ({
  docs: {
    source: {
      code: `
      import { Select, Text} from "@securitybankph/storybook-web";
      ${code}
      `.trim(),
      language: "tsx",
      format: true,
    },
  },
});

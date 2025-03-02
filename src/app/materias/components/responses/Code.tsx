interface Params {
  code: string;
}

export const Code = ({ code }: Params) => {
  return (
    <pre>
      <code>{code}</code>
    </pre>
  );
};

export default async function PrivacitySection({
  header,
  description,
}: {
  header?: string | undefined;
  description: React.ReactNode;
}) {
  return (
    <section>
      {header ? (
        <h2 className="text-2xl">
          <b>{header}</b>
        </h2>
      ) : null}
      <div className="pl-1">{description}</div>
    </section>
  );
}

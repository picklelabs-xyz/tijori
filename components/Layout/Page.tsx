import Head from "next/head";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

const Page = (props: Props) => {
  const {
    title = "Tijori NFT",
    description = "Tijori NFT- Securely lock and access digital content with NFTs using Tijori",
    children,
  } = props;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="decription" content={description} key="description" />
      </Head>
      <div>{children}</div>
    </>
  );
};
export default Page;

import { Tag } from "../components/Tag";

export default function ComponentsShowcase() {
  const pageStyle = {
    backgroundColor: "gray",
  };

  return (
    <>
      <div style={pageStyle}>
        <h1>Components Showcase</h1>
        <Tag>Automation</Tag>
        <Tag className="secondary">Automation</Tag>
      </div>
    </>
  );
}

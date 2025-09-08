import AutoLayout from "../components/AutoLayout";
import { Tag } from "../components/Tag";

export default function ComponentsShowcase() {
  return (
    <div
      style={{ backgroundColor: "green", width: "100%" }}
    >
      <h1>Components Showcase</h1>
      <AutoLayout gap={8}>
        <Tag>Automation</Tag>
        <Tag className="secondary">Automation</Tag>
      </AutoLayout>
    </div>
  );
}

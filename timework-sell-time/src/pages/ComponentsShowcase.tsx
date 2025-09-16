import { AutoLayoutVertical } from "../components/AutoLayout";
import { Tag, HeaderTag } from "../components/Tag";
import { Card, CardHeader } from "../components/Card";

export default function ComponentsShowcase() {
  return (
    <div
      style={{
        backgroundColor: "gray",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          margin: "20px",
        }}
      >
        <AutoLayoutVertical gap={8}>
          <Tag>Automation</Tag>
          <Tag className="secondary">Automation</Tag>
          <HeaderTag>Automation</HeaderTag>
          <HeaderTag className="secondary">
            Automation
          </HeaderTag>
          <Card>
            <CardHeader>
              <HeaderTag>Automation</HeaderTag>
              <HeaderTag className="secondary">
                Automation
              </HeaderTag>
            </CardHeader>
            This is a card component.
          </Card>
        </AutoLayoutVertical>
      </div>
    </div>
  );
}

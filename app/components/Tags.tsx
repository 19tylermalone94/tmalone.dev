/**
 * Renders a "·"-separated tag string as individual pills.
 * Pills inherit the section's --accent (background at 10%, text at full).
 */
export default function Tags({ items }: { items: string }) {
  const list = items
    .split("·")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="tags">
      {list.map((tag) => (
        <span className="tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

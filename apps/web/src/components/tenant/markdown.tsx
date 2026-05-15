/**
 * Minimal Markdown renderer — headings, paragraphs, bullet/ordered lists,
 * bold + italic. Intentionally not pulling in a full Markdown lib until
 * we know what features we actually need.
 */
export function Markdown({ md }: { md: string }) {
  const blocks = md.split(/\n\n+/);
  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="mt-10 text-balance text-4xl font-bold tracking-tight md:text-5xl"
            >
              {inline(trimmed.slice(2))}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-10 text-2xl font-semibold tracking-tight"
            >
              {inline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="mt-8 text-xl font-semibold">
              {inline(trimmed.slice(4))}
            </h3>
          );
        }
        if (/^\s*\d+\.\s/.test(trimmed)) {
          const items = trimmed
            .split(/\n/)
            .map((l) => l.replace(/^\s*\d+\.\s/, ""));
          return (
            <ol
              key={i}
              className="mt-4 list-decimal space-y-1 pl-6 text-zinc-700"
            >
              {items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ol>
          );
        }
        if (/^\s*[-*]\s/.test(trimmed)) {
          const items = trimmed
            .split(/\n/)
            .map((l) => l.replace(/^\s*[-*]\s/, ""));
          return (
            <ul
              key={i}
              className="mt-4 list-disc space-y-1 pl-6 text-zinc-700"
            >
              {items.map((it, j) => (
                <li key={j}>{inline(it)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className="mt-4 text-base leading-relaxed text-zinc-700"
          >
            {inline(trimmed)}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string): React.ReactNode {
  // Order matters: bold (**) before italic (*) so the `*` inside `**` doesn't
  // get gobbled. Links: [text](url).
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("*") && p.endsWith("*")) {
      return <em key={i}>{p.slice(1, -1)}</em>;
    }
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          className="underline hover:text-zinc-900"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return p;
  });
}

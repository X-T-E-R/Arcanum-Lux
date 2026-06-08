import type { ReactNode } from "react";

interface MarkdownTextProps {
  text: string;
  className?: string;
}

function inlineMarkdown(text: string): ReactNode[] {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="rounded bg-midnight/70 px-1 py-0.5 font-mono text-[0.9em] text-gold-200/80">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-gold-50">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic text-gold-100/90">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
}

function renderLines(lines: string[]): ReactNode[] {
  return lines.flatMap((line, index) => [
    index > 0 ? <br key={`br-${index}`} /> : null,
    <span key={`line-${index}`}>{inlineMarkdown(line)}</span>,
  ]);
}

export default function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  const blocks = text.split(/\n{2,}/).filter((block) => block.trim());

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").filter((line) => line.trim());
        const firstLine = lines[0] ?? "";
        const heading = firstLine.match(/^(#{1,3})\s+(.+)$/);

        if (heading) {
          const size = heading[1].length === 1 ? "text-base" : heading[1].length === 2 ? "text-sm" : "text-xs";
          return (
            <h3 key={index} className={`${size} font-heading font-semibold text-gold-50 ${index > 0 ? "mt-3" : ""}`}>
              {inlineMarkdown(heading[2])}
            </h3>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
          return (
            <ul key={index} className={`list-disc pl-4 ${index > 0 ? "mt-2" : ""}`}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{inlineMarkdown(line.trim().replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
          return (
            <ol key={index} className={`list-decimal pl-4 ${index > 0 ? "mt-2" : ""}`}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{inlineMarkdown(line.trim().replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => /^>\s?/.test(line.trim()))) {
          return (
            <blockquote key={index} className={`border-l border-gold-400/20 pl-3 text-gold-200/70 ${index > 0 ? "mt-2" : ""}`}>
              {renderLines(lines.map((line) => line.trim().replace(/^>\s?/, "")))}
            </blockquote>
          );
        }

        return (
          <p key={index} className={index > 0 ? "mt-2" : ""}>
            {renderLines(lines)}
          </p>
        );
      })}
    </div>
  );
}

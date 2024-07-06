import { anyScopeRegex, blockRegex, defaultRules, inlineRegex } from "simple-markdown";
import { MarkdownRule } from "../helpers";

const HEADER_RE = /^(#{1,3}) +(.+?)( *#*)? *(?:\n+|$)/;

export const header: MarkdownRule = {
  order: defaultRules.heading.order,
  match: inlineRegex(HEADER_RE),
  parse: capture => {
    const [, level, content] = capture;
    return {
      level: level.length,
      content: content.trim()
    };
  },
  react: (node, output, state) => {
    const Tag = `h${node.level}` as keyof JSX.IntrinsicElements;
    return (
      <Tag key={state.key} className={`header-${node.level}`}>
        <span>{node.content}</span>
      </Tag>
    );
  }
};
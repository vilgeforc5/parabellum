import React from 'react';
import type { BlogPostContent } from '@/lib/strapi';

// ─── Strapi Blocks types ───

type TextNode = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: 'link';
  url: string;
  children: TextNode[];
};

type InlineNode = TextNode | LinkNode;

type ParagraphBlock = { type: 'paragraph'; children: InlineNode[] };
type HeadingBlock = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
};
type ListItemBlock = { type: 'list-item'; children: InlineNode[] };
type ListBlock = {
  type: 'list';
  format: 'ordered' | 'unordered';
  children: ListItemBlock[];
};
type QuoteBlock = { type: 'quote'; children: InlineNode[] };
type CodeBlock = { type: 'code'; children: TextNode[] };
type ImageBlock = {
  type: 'image';
  image: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
  children: TextNode[];
};

type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock
  | ImageBlock;

// ─── Inline renderer ───

function renderInline(nodes: InlineNode[]): React.ReactNode {
  return nodes.map((node, i) => {
    if (node.type === 'link') {
      return (
        <a
          key={i}
          href={node.url}
          target="_blank"
          rel="noreferrer"
          className="text-chart-1 underline decoration-chart-1/40 underline-offset-4 hover:text-chart-2 transition-colors"
        >
          {node.children.map((c, j) => renderText(c, j))}
        </a>
      );
    }
    return renderText(node, i);
  });
}

function renderText(node: TextNode, key: number): React.ReactNode {
  let content: React.ReactNode = node.text;
  if (node.bold) content = <strong key={key}>{content}</strong>;
  if (node.italic) content = <em key={key}>{content}</em>;
  if (node.underline) content = <u key={key}>{content}</u>;
  if (node.strikethrough) content = <s key={key}>{content}</s>;
  if (node.code)
    content = (
      <code
        key={key}
        className="rounded bg-muted px-1 py-0.5 text-sm font-mono"
      >
        {content}
      </code>
    );
  return <React.Fragment key={key}>{content}</React.Fragment>;
}

// ─── Block renderer ───

const headingClass: Record<number, string> = {
  1: 'text-3xl font-bold tracking-tight mt-10 mb-4',
  2: 'text-2xl font-bold tracking-tight mt-8 mb-3',
  3: 'text-xl font-semibold mt-6 mb-2',
  4: 'text-lg font-semibold mt-5 mb-2',
  5: 'text-base font-semibold mt-4 mb-1',
  6: 'text-sm font-semibold mt-4 mb-1',
};

function renderBlock(block: Block, index: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="leading-8 text-muted-foreground my-4">
          {renderInline(block.children)}
        </p>
      );

    case 'heading': {
      const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={index} className={headingClass[block.level]}>
          {renderInline(block.children)}
        </Tag>
      );
    }

    case 'list':
      if (block.format === 'ordered') {
        return (
          <ol
            key={index}
            className="list-decimal list-outside ml-6 my-4 space-y-1"
          >
            {block.children.map((item, j) => (
              <li key={j} className="text-muted-foreground leading-7">
                {renderInline(item.children)}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={index} className="list-disc list-outside ml-6 my-4 space-y-1">
          {block.children.map((item, j) => (
            <li key={j} className="text-muted-foreground leading-7">
              {renderInline(item.children)}
            </li>
          ))}
        </ul>
      );

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-chart-1 pl-5 my-6 italic text-muted-foreground"
        >
          {renderInline(block.children)}
        </blockquote>
      );

    case 'code':
      return (
        <pre
          key={index}
          className="my-6 rounded-lg bg-muted p-4 overflow-x-auto text-sm font-mono"
        >
          <code>{block.children.map((c) => c.text).join('')}</code>
        </pre>
      );

    case 'image':
      return (
        <figure key={index} className="my-8">
          <img
            src={block.image.url}
            alt={block.image.alternativeText ?? ''}
            width={block.image.width}
            height={block.image.height}
            className="rounded-xl w-full object-cover"
          />
          {block.image.alternativeText && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.image.alternativeText}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

interface BlocksRendererProps {
  content: BlogPostContent | null | undefined;
}

export function BlocksRenderer({ content }: BlocksRendererProps) {
  if (!Array.isArray(content)) return null;

  return (
    <div className="max-w-none">
      {(content as Block[]).map((block, i) => renderBlock(block, i))}
    </div>
  );
}

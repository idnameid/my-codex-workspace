"use client";

import { useMemo } from "react";
import { TagNode } from "@/lib/tagTree";

type TagTreeProps = {
  nodes: TagNode[];
  selected: string[];
  onToggle: (id: string) => void;
};

const renderNodes = (nodes: TagNode[], selected: string[], onToggle: (id: string) => void) => {
  return (
    <ul className="space-y-2">
      {nodes.map((node) => (
        <li key={node.id}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(node.id)}
              onChange={() => onToggle(node.id)}
              className="h-4 w-4"
            />
            <span className="font-medium text-slate-700">{node.label_ko}</span>
          </label>
          {node.children && node.children.length > 0 && (
            <div className="ml-6 mt-2 border-l border-slate-200 pl-4">
              {renderNodes(node.children, selected, onToggle)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default function TagTree({ nodes, selected, onToggle }: TagTreeProps) {
  const tree = useMemo(() => renderNodes(nodes, selected, onToggle), [nodes, onToggle, selected]);
  return <div>{tree}</div>;
}

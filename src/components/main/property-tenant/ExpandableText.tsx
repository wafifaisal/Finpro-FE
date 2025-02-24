"use client";
import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
  limit?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  limit = 100,
}) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const toggleExpanded = () => setExpanded(!expanded);

  if (text.length <= limit) {
    return (
      <p
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  const displayText = expanded ? text : text.substring(0, limit) + "...";

  return (
    <div>
      <p
        className="text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
      <button
        onClick={toggleExpanded}
        className="mt-1 text-rose-600 text-sm font-medium focus:outline-none"
      >
        {expanded ? "Sembunyikan" : "Lihat Selengkapnya"}
      </button>
    </div>
  );
};

export default ExpandableText;

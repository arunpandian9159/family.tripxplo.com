import React from 'react';

interface ParagraphProps {
  heading: string;
  text: string;
}
const Paragraph: React.FC<ParagraphProps> = ({ text, heading }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl text-neutral-700 font-semibold mb-3">{heading}</h1>
      <h1 className="text-neutal-600 ">{text}</h1>
    </div>
  );
};

export default Paragraph;

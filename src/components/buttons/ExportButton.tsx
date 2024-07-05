import React, { useEffect } from 'react';
import BasicButton from './BasicButton';

interface ExportButtonProps {
    content: string,
    text: string
    fileName: string,
    fileExt: string
}

export default function ExportButton({ content,text,fileName,fileExt } : ExportButtonProps) {
  const handleButtonClick = () => {
    const downloadUrl = URL.createObjectURL(new Blob([content]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName + '.' + fileExt;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(content);
    };
  }, [content]);

  return (
    <BasicButton onClick={handleButtonClick}>{text}</BasicButton>
  );
};

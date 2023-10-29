'use client';

import { FileWithPath } from '@mantine/dropzone';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from 'react';

function convertToPlain(rtf: string) {
  rtf = rtf.replace(/\\par[d]?/g, "");
  return rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim();
}

export type FileReaderContextProps = {
  file: FileWithPath | null;
  lines: string[];
  wordCounts: Record<string, number>;
  setFile: Dispatch<SetStateAction<FileWithPath | null>>;
  setLines: Dispatch<SetStateAction<string[]>>;
};

export const FileReaderContext = createContext<FileReaderContextProps>({
  file: null,
  lines: [],
  wordCounts: {},
  setFile: () => { },
  setLines: () => { },
});

export const FileReaderProvider = ({ children }: PropsWithChildren) => {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const fileContent = event.target?.result;
        if (typeof event.target?.result === 'string') {
          const txtContent = convertToPlain(event.target.result);
          const lines = txtContent.split(/\r?\n|\r\n/);
          setLines(lines.filter((line) => {
            return line.length !== 0 || line !== '\\';
          }));
          const wordsOnly = txtContent.replace(/[^a-zA-Z0-9 ]/g, ''); // Removes non-word characters
          const words = wordsOnly.split(/\s+/);
          const dictionary: Record<string, number> = {};
          words.map((word) => word.trim())
            .filter((word) => word.length > 0)
            .forEach((word) => {
              if (dictionary[word]) {
                dictionary[word] += 1;
              } else {
                dictionary[word] = 1;
              }
            });
          setWordCounts(dictionary);
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  const values = useMemo(() => {
    return {
      file,
      lines,
      wordCounts,
      setFile,
      setLines,
    }
  }, [file, lines, wordCounts, setFile, setLines]);

  return (
    <FileReaderContext.Provider value={values}>
      {children}
    </FileReaderContext.Provider>
  );
}

export const useFileReader = () => {
  const context = useContext(FileReaderContext)
  return context;
}
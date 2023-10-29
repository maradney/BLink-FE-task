'use client';

import Preview from "@/components/Preview";
import Reader from "@/components/Reader";
import { FileReaderProvider } from "./contexts/useFileReader";

export default function Home() {
  return (
    <main className="flex flex-col lg:flex-row flex-grow min-h-screen p-12 lg:p-24 gap-4">
      <FileReaderProvider>
        <Reader />
        <Preview />
      </FileReaderProvider>
    </main>
  )
}

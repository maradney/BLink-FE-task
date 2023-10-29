'use client';

import { notifications } from "@mantine/notifications";
import { Group, Stack, Text, rem } from "@mantine/core";
import { Dropzone, FileRejection, FileWithPath } from "@mantine/dropzone";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";
import { useFileReader } from "@/app/contexts/useFileReader";

const textMimeTypes = [
  'text/plain',
  'text/rtf',
  'application/rtf',
];

export default function Reader() {
  const { file, setFile } = useFileReader();

  const onAccept = (files: FileWithPath[]) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

  const onReject = (files: FileRejection[]) => {
    if (files && files.length > 0) {
      const [file] = files;
      notifications.show({
        color: 'red',
        title: 'Ooh!',
        autoClose: false,
        message: (
          <>
            <Text>Something went wrong!</Text>
            <Text>{file.errors[0].message}</Text>
          </>
        ),
      });
    }
  }

  return (
    <Stack className="w-full lg:w-1/3 p-4 bg-navy rounded-lg shadow-lg text-white" gap="xl">
      <Dropzone
        maxFiles={1}
        className="!bg-transparent !text-white"
        onDrop={onAccept}
        onReject={onReject}
        maxSize={20 * 1024 ** 2}
        accept={textMimeTypes}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFile
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag a text file here or click to select file
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              File needs to be of type .txt with max size of 20MB
            </Text>
          </div>
        </Group>
      </Dropzone>
      {
        file && (
          <Stack>
            <div className="flex gap-4">
              <span className="rounded-xl bg-pink px-4 py-2">
                Name:
              </span>
              <span className="px-4 py-2">
                {file.name}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="rounded-xl bg-pink px-4 py-2">
                Type:
              </span>
              <span className="px-4 py-2">
                {file.type}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="rounded-xl bg-pink px-4 py-2">
                Size:
              </span>
              <span className="px-4 py-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </Stack>
        )
      }
    </Stack>
  )
}

'use client';

import { Group, Stack, Table } from "@mantine/core";
import { useFileReader } from "@/app/contexts/useFileReader";

export default function Preview() {
  const { lines, wordCounts } = useFileReader();
  return (
    <div className="w-full lg:w-2/3 bg-pink rounded-lg p-6 shadow-lg">
      <Stack gap="xl">
        {
          lines.length > 0 && (
            <Stack mah="600px" className="pb-2 border-b-2 border-dashed border-t-2 border-navy bg-navy text-pink rounded-lg overflow-scroll" gap="0">
              {
                lines.map((line, i) => {
                  return (
                    <Group key={`file-display-line-${i}`} gap="0" className="!flex-nowrap">
                      <div className="w-20 mr-4 pr-2 border-r border-r-pink text-end flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="whitespace-nowrap">
                        {line}
                      </div>
                    </Group>
                  )
                })
              }
            </Stack>
          )
        }
        {
          Object.keys(wordCounts).length > 0 && (
            <Stack mah="600px" className="overflow-scroll border-2 border-navy bg-navy text-pink rounded-lg" gap="0">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      Word
                    </Table.Th>
                    <Table.Th colSpan={2}>
                      Count
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {
                    Object.keys(wordCounts).map((key, i) => {
                      return (
                        <Table.Tr key={`word-count-row-${i}`}>
                          <Table.Td maw="150px" className="!break-words">
                            {key}
                          </Table.Td>
                          <Table.Td width="100%" colSpan={2}>
                            {wordCounts[key]}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  }
                </Table.Tbody>
              </Table>
            </Stack>
          )
        }
      </Stack>
    </div>
  )
}

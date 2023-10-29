import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { FileReaderContext, FileReaderContextProps } from '@/app/contexts/useFileReader';
import { PropsWithChildren } from 'react';
import Reader from '@/components/Reader';
import Preview from '@/components/Preview';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});


const MockedProvider = ({ values, children }: PropsWithChildren & { values: FileReaderContextProps }) => {
  return (
    <FileReaderContext.Provider value={values}>
      {children}
    </FileReaderContext.Provider>
  );
};

describe('Articles tests', () => {
  it('should set file on file upload', async () => {
    const values = {
      file: null,
      lines: [],
      wordCounts: {},
      setFile: jest.fn(),
      setLines: jest.fn(),
    };
    const { container } = render(
      <MantineProvider>
        <MockedProvider values={values}>
          <Reader />
        </MockedProvider>
      </MantineProvider>
    );

    const fileInput = container.querySelector('input') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    // Mock the file data as a Blob and create a File object
    const fileContent = 'Mocked file content then repeat again and again and again ';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([blob], 'mocked-file.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput?.files ? fileInput?.files[0] : null).toStrictEqual(file);

    await waitFor(() => {
      expect(values.setFile).toHaveBeenCalledWith(file);
    });
  });

  it('should show basic file data, file conent and word counts', async () => {
    const fileContent = 'Mocked file content then repeat again and again and again';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([blob], 'mocked-file.txt', { type: 'text/plain' });
  
    const values = {
      file: file,
      lines: [fileContent],
      wordCounts: {again: 3},
      setFile: jest.fn(),
      setLines: jest.fn(),
    };
    render(
      <MantineProvider>
        <MockedProvider values={values}>
          <Reader />
          <Preview />
        </MockedProvider>
      </MantineProvider>
    );

    expect(screen.getByText('mocked-file.txt')).toBeVisible();
    expect(screen.getByText(fileContent)).toBeVisible();
    expect(screen.getByText('3')).toBeVisible();
  });
});

// CloudFilePicker.test.tsx
import {render, act} from '@testing-library/react';

import {CloudFilePicker} from '.';

describe('CloudFilePicker component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('renders CloudFilePicker component', async () => {
        // Mock props as needed
        const mockProps = {
            accessToken: 'your-access-token',
            onConfirmSelection: jest.fn(),
        };

        // Mock the fetch function
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({value: []}), // Mock response JSON
        });

        await act(async () => {
            render(<CloudFilePicker {...mockProps} />);
        });

        // Your component rendering assertions go here

        // Optionally, you can assert that fetch was called with the expected parameters
        expect(global.fetch).toHaveBeenCalledWith('https://graph.microsoft.com/v1.0/me/drive/special/photos/children', {
            headers: {
                Authorization: 'Bearer your-access-token',
            },
        });
    });

    // Add more test cases as needed
});

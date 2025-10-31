import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CalendarBlock from './CalendarBlock';

// 1. Mock the entire module containing the API function
// The path must match the import path in CalendarBlock.jsx
import * as calendarService from '../../services/calendarService'; 

// Create a spy/mock function for listCalendars
const listCalendarsMock = vi.spyOn(calendarService, 'listCalendars');

// --- Mock Data ---
const mockCalendars = [
  { id: '101', name: 'Annual Events' },
  { id: '102', name: 'Monthly Meetings' },
];
const mockClubId = 42;

// ------------------------------------------------------------------

describe('CalendarBlock', () => {

  // Clean up mocks after each test to ensure test isolation
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ------------------------------------------------------------------

  test('should display a loading state and then the list of calendars', async () => {
    // 2. Define the mock implementation for this specific test
    // Return a Promise that resolves with our mock data
    listCalendarsMock.mockResolvedValue(mockCalendars);

    render(<CalendarBlock clubId={mockClubId} />);

    // Assertion 1: Check the initial state (before useEffect completes)
    // The component title should be present immediately
    expect(screen.getByRole('heading', { name: /calendars/i })).toBeInTheDocument();
    
    // Assertion 2: Wait for the asynchronous data to appear
    // We use waitFor() because the state update happens inside useEffect (asynchronously)
    await waitFor(() => {
      // Check for an element from the mock data to confirm success
      expect(screen.getByText('Annual Events')).toBeInTheDocument();
    });

    // Assertion 3: Verify all items are rendered
    expect(screen.getByText('Monthly Meetings')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(mockCalendars.length);
    
    // Assertion 4: Verify the API was called correctly
    expect(listCalendarsMock).toHaveBeenCalledTimes(1);
    expect(listCalendarsMock).toHaveBeenCalledWith(mockClubId);
  });

  // ------------------------------------------------------------------

  test('should display "No calendars yet" when the API returns an empty list', async () => {
    // 3. Define the mock implementation to return an empty array
    listCalendarsMock.mockResolvedValue([]);

    render(<CalendarBlock clubId={mockClubId} />);

    // Wait for the asynchronous call to resolve and the component to re-render
    await waitFor(() => {
      // Assertion: Check for the "empty" message
      expect(screen.getByText('No calendars yet.')).toBeInTheDocument();
    });
    
    // Assertion: Ensure no list items were rendered
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(listCalendarsMock).toHaveBeenCalledWith(mockClubId);
  });
});
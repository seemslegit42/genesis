/**
 * @fileoverview Defines a 'getCalendarEvents' tool for the AI.
 * This allows BEEP to fetch the user's schedule for the day, which is a
 * critical component for "The Daily Cipher" feature.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CalendarResultSchema } from '@/lib/types';

/**
 * Defines a tool that fetches calendar events for the current day.
 * In a real application, this would connect to Google Calendar, Outlook, etc.
 * For now, it returns a realistic mock data structure to demonstrate the feature.
 */
export const getCalendarEvents = ai.defineTool(
  {
    name: 'getCalendarEvents',
    description: "Get the user's calendar events for today.",
    inputSchema: z.object({}), // No input needed
    outputSchema: z.string().describe("A JSON string of today's calendar events."),
  },
  async () => {
    console.log(`[Calendar Tool] Fetching today's mocked events.`);
    
    // In a real application, this would call a calendar API.
    // This mock data simulates a busy day to demonstrate the "Daily Cipher" feature.
    const mockEvents = {
      type: 'calendarResults',
      events: [
        {
          summary: 'Project Phoenix: Daily Stand-up',
          start: '09:00 AM',
          end: '09:30 AM',
          description: 'Review progress and blockers.',
        },
        {
          summary: 'Design Review: New Onboarding Flow',
          start: '11:00 AM',
          end: '12:00 PM',
          attendees: ['designer@example.com', 'pm@example.com'],
        },
        {
          summary: 'Lunch',
          start: '12:30 PM',
          end: '01:30 PM',
          description: 'Recharge.',
        },
        {
          summary: '1:1 with Manager',
          start: '03:00 PM',
          end: '03:30 PM',
          description: 'Discuss quarterly goals.',
        },
         {
          summary: 'Focus Block: Code implementation for feature #123',
          start: '03:30 PM',
          end: '05:00 PM',
          description: 'Implement the backend logic as discussed.',
        },
      ]
    };

    // Validate the data against the Zod schema before returning
    const validatedData = CalendarResultSchema.parse(mockEvents);

    return JSON.stringify(validatedData);
  }
);

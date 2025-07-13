
import type { CalendarResult as CalendarResultType } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CalendarIcon, Clock, Users } from 'lucide-react';

interface CalendarResultProps {
  events: CalendarResultType['events'];
}

/**
 * Renders a list of calendar events in a structured, visually appealing card format.
 * This component takes the raw JSON output from the calendar tool and transforms it
 * into a rich, interactive element within the chat stream, providing a clear
 * overview of the user's daily schedule.
 * @param {CalendarResultProps} props The props for the component.
 * @returns {JSX.Element} The rendered calendar results component.
 */
export function CalendarResult({ events }: CalendarResultProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none w-full max-w-sm md:max-w-lg lg:max-w-3xl">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4 pt-5 px-5">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-headline text-primary">Today's Cipher</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className="group block p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors duration-200"
              >
                <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors duration-200">
                  {event.summary}
                </h4>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.start} - {event.end}</span>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                )}
                {event.attendees && event.attendees.length > 0 && (
                   <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                     <Users className="h-4 w-4" />
                     <span>{event.attendees.join(', ')}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-4">
              <p>No events found for today. Your day is clear.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

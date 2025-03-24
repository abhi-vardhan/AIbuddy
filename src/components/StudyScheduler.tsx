
import { useState } from 'react';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DateTimePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Card } from '@/components/ui/card';
import { NumericTextBox } from '@progress/kendo-react-inputs';

interface StudyEvent {
  id: number;
  title: string;
  date: Date;
  duration: number;
}

const StudyScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDuration, setEventDuration] = useState<number>(60);
  const [events, setEvents] = useState<StudyEvent[]>([
    { id: 1, title: 'Review Biology Notes', date: new Date(2023, 9, 15, 14, 0), duration: 60 },
    { id: 2, title: 'Math Practice Problems', date: new Date(2023, 9, 16, 10, 0), duration: 90 },
  ]);

  const handleAddEvent = () => {
    const newEvent: StudyEvent = {
      id: events.length + 1,
      title: eventTitle,
      date: eventDate,
      duration: eventDuration,
    };
    setEvents([...events, newEvent]);
    setEventTitle('');
    setShowDialog(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Study Schedule Planner</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Choose a Date</h3>
          <Calendar
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value as Date)}
          />
          
          <div className="mt-6">
            <Button 
              themeColor="primary"
              onClick={() => setShowDialog(true)}
              className="w-full"
            >
              Schedule Study Session
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Your Study Sessions</h3>
          <Grid
            data={events}
            style={{ height: '400px' }}
          >
            <GridColumn field="title" title="Study Topic" width="200px" />
            <GridColumn 
              field="date" 
              title="Date & Time" 
              width="200px"
              cell={(props) => (
                <td>{formatDate(props.dataItem.date)}</td>
              )}
            />
            <GridColumn 
              field="duration" 
              title="Duration" 
              width="120px"
              cell={(props) => (
                <td>{props.dataItem.duration} min</td>
              )}
            />
          </Grid>
        </div>
      </div>

      {showDialog && (
        <Dialog
          title="Schedule a New Study Session"
          onClose={() => setShowDialog(false)}
          width={400}
        >
          <div className="mb-4">
            <label className="block mb-2 font-medium">Topic:</label>
            <input
              className="w-full p-2 border rounded"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Enter study topic"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Date and Time:</label>
            <DateTimePicker
              value={eventDate}
              onChange={(e) => setEventDate(e.value as Date)}
              format="MM/dd/yyyy HH:mm"
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Duration (minutes):</label>
            <NumericTextBox
              value={eventDuration}
              onChange={(e) => setEventDuration(e.value as number)}
              format="n0"
              min={5}
              max={240}
              step={5}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button themeColor="primary" onClick={handleAddEvent}>Add Session</Button>
          </div>
        </Dialog>
      )}
    </Card>
  );
};

export default StudyScheduler;

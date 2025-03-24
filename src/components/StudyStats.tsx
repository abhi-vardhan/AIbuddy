
import { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Typography } from '@progress/kendo-react-common';
import { Card } from '@/components/ui/card';
import { process } from '@progress/kendo-data-query';

// Since we're having issues with the charts import, let's use a simpler approach for now
import { PDFExport } from '@progress/kendo-react-pdf';

const studyTimeData = [
  { day: 'Monday', hours: 2.5 },
  { day: 'Tuesday', hours: 1.5 },
  { day: 'Wednesday', hours: 3.0 },
  { day: 'Thursday', hours: 2.0 },
  { day: 'Friday', hours: 1.0 },
  { day: 'Saturday', hours: 3.5 },
  { day: 'Sunday', hours: 2.0 },
];

const subjects = [
  { text: 'All Subjects', value: 'all' },
  { text: 'Mathematics', value: 'math' },
  { text: 'Science', value: 'science' },
  { text: 'History', value: 'history' },
  { text: 'Literature', value: 'literature' },
  { text: 'Computer Science', value: 'cs' },
];

const studySessionsData = [
  { id: 1, subject: 'Mathematics', topic: 'Calculus', duration: 90, date: '2023-10-10', completed: true },
  { id: 2, subject: 'Science', topic: 'Physics - Motion', duration: 60, date: '2023-10-11', completed: true },
  { id: 3, subject: 'History', topic: 'World War II', duration: 120, date: '2023-10-12', completed: false },
  { id: 4, subject: 'Literature', topic: 'Shakespeare', duration: 45, date: '2023-10-13', completed: true },
  { id: 5, subject: 'Computer Science', topic: 'Algorithms', duration: 75, date: '2023-10-14', completed: false },
];

const StudyStats = () => {
  const [selectedSubject, setSelectedSubject] = useState({ text: 'All Subjects', value: 'all' });
  const [gridData, setGridData] = useState(process(studySessionsData, {
    sort: [{ field: 'date', dir: 'desc' }]
  }));
  
  const handleSubjectChange = (event: any) => {
    setSelectedSubject(event.target.value);
    
    // Filter data if a specific subject is selected
    if (event.target.value.value !== 'all') {
      const filtered = studySessionsData.filter(item => 
        item.subject.toLowerCase() === event.target.value.value
      );
      setGridData(process(filtered, { sort: [{ field: 'date', dir: 'desc' }] }));
    } else {
      setGridData(process(studySessionsData, { sort: [{ field: 'date', dir: 'desc' }] }));
    }
  };

  return (
    <Card className="p-6 w-full max-w-4xl mx-auto">
      <Typography.h2 className="text-2xl font-bold mb-6 text-center">Study Statistics</Typography.h2>
      
      <div className="mb-6">
        <Typography.p className="mb-2">Select Subject:</Typography.p>
        <DropDownList
          data={subjects}
          textField="text"
          dataItemKey="value"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Typography.h3 className="text-lg font-medium mb-4">Weekly Study Hours</Typography.h3>
          <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
            <Typography.p className="text-gray-500">
              Weekly hours chart placeholder
            </Typography.p>
          </div>
        </div>
        
        <div>
          <Typography.h3 className="text-lg font-medium mb-4">Total Hours by Subject</Typography.h3>
          <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
            <Typography.p className="text-gray-500">
              Subject distribution chart placeholder
            </Typography.p>
          </div>
        </div>
      </div>
      
      <div>
        <Typography.h3 className="text-lg font-medium mb-4">Recent Study Sessions</Typography.h3>
        <Grid
          data={gridData.data}
          sortable={true}
          style={{ height: '300px' }}
        >
          <GridColumn field="subject" title="Subject" width="150px" />
          <GridColumn field="topic" title="Topic" width="200px" />
          <GridColumn field="duration" title="Duration (min)" width="130px" />
          <GridColumn field="date" title="Date" width="120px" />
          <GridColumn 
            field="completed" 
            title="Status" 
            width="120px"
            cell={(props) => (
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  props.dataItem.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {props.dataItem.completed ? 'Completed' : 'Pending'}
                </span>
              </td>
            )}
          />
        </Grid>
      </div>
    </Card>
  );
};

export default StudyStats;

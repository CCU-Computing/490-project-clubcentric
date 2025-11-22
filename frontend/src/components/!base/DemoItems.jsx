import React, { useState } from "react";
import { TextField } from "./TextField";
import { DateField } from "./DateField";
import { FileField } from "./FileField";
import { SelectField } from "./SelectField";
import { ActionButton } from "./ActionButton";

export default function FormComponentsDemo() {
  const [textValue, setTextValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [file, setFile] = useState(null);
  const [selectValue, setSelectValue] = useState('');

  const clubOptions = [
    { value: 'chess', label: 'Chess Club' },
    { value: 'debate', label: 'Debate Team' },
    { value: 'robotics', label: 'Robotics Club' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-8" style={{ backgroundColor: '#f9fafb' }}>
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#093331' }}>
        Form Components Demo
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <TextField
          label="Club Name"
          value={textValue}
          onChange={setTextValue}
          placeholder="Enter club name"
          required
        />

        <DateField
          label="Meeting Date"
          value={dateValue}
          onChange={setDateValue}
          required
        />

        <FileField
          label="Upload Document"
          onChange={setFile}
          accept=".pdf,.doc,.docx"
        />

        <SelectField
          label="Select Club"
          value={selectValue}
          onChange={setSelectValue}
          options={clubOptions}
          required
        />

        <div className="flex gap-4 mt-6">
          <ActionButton
            label="Submit"
            onClick={() => alert('Form submitted!')}
            variant="primary"
          />
          <ActionButton
            label="Cancel"
            onClick={() => alert('Cancelled')}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}
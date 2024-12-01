import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const SelectMonth = ({ selected, setSelected }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Duration (Months)</InputLabel>
      <Select
        value={selected || ''}
        onChange={(e) => setSelected(e.target.value)}
        label="Duration (Months)"
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
      >
        {[...Array(12).keys()].map((i) => {
          const month = i + 1;
          return (
            <MenuItem key={month} value={month}>
              {month} months
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectMonth;

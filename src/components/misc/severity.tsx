import React from 'react';
import { SeverityIcon } from '~/components/misc/icons';
import { EventType } from '~/classes/EventType';

interface SeverityData {
  eventType: EventType;
}
const Severities = {
  '1': {
    color: '#FBCF21',
    label: 'Low',
  },
  '2': {
    color: '#FB7E23',
    label: 'Warning',
  },
  '3': {
    color: '#FF0000',
    label: 'High',
  },
};
export const Severity = ({ eventType }: SeverityData) => {
  const severity = Severities[eventType?.severity?.name] || Severities['3'];
  return (
    <div>
      <span>
        <SeverityIcon color={severity.color} /> {severity.label}
      </span>
    </div>
  );
};

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  NONE = 'None',
}

export enum Reaction {
  THUMBS_UP = 'ThumbsUp',
  THUMBS_DOWN = 'ThumbsDown',
  NONE = 'None',
}

export interface EventCard {
  id: string;
  comment: string;
  userIds?: string[];
  createdUserEmail: string;
  createdUserFullName: string;

  location?: string;
  title?: string;

  createdDate: string;
  modifiedDate: string;
}

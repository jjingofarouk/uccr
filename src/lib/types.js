export type Case = {
  id: string;
  title: string;
  presentingComplaint: string;
  history: string;
  investigations: string;
  management: string;
  imageUrl?: string;
  userId: string;
  userName: string;
  createdAt: Date;
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: Date;
};

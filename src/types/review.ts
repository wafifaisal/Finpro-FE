export interface IUser {
  id: string;
  name: string;
  avatar: string; // URL for the user's avatar image
}

export interface IReview {
  id: number;
  rating: number;
  review: string;
  user_id: string;
  user: IUser; // Added user details
  room_types_id: number;
  booking_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  reply?: IReviewReplies | null;
  propertyName: string; // Added property name
}

export interface IReviewReplies {
  id: number;
  tenant_id: string;
  review_id: number;
  reply: string;
}

export interface IReview {
  id: number;
  rating: number;
  review: string;
  user_id: string;
  room_types_id: number;
  booking_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  reply?: IReviewReplies | null;
}

export interface IReviewReplies {
  id: number;
  tenant_id: string;
  review_id: number;
  reply: string;
}

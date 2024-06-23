export type gifType = {
  name: string[];
  url: string;
  createdAt: number;
  upvote: {
    [ip: string]: number;
  };
  isUpvoted?: boolean;
  isVerified: boolean;
};

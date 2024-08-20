export type gifType = {
  name: string[];
  url: string;
  size: {
    width: number;
    height: number;
  };
  upvote: number;
  isUpvoted?: boolean;
};

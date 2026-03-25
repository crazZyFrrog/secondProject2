export type Block =
  | { type: "hero"; title: string; subtitle: string }
  | { type: "text"; body: string };

export type PageContent = { blocks: Block[] };

export type Project = {
  id: number;
  user_id: number;
  name: string;
  content: PageContent;
};

export type User = { id: number; email: string };

export type UserCompetitorConfig = {
  name: string;
  domain: string | null;
};

export type UserBrandConfig = {
  brand_name: string | null;
  primary_domain: string | null;
  competitors: UserCompetitorConfig[];
};


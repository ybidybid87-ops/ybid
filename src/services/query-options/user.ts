import { queryOptions } from "@tanstack/react-query";
import { getMe } from "../actions/user/get-me";
import { getUsers } from "../actions/user/get-users";
import { userKeys } from "../query-keys";

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),
      queryFn: getMe,
    }),

  list: () =>
    queryOptions({
      queryKey: userKeys.list(),
      queryFn: getUsers,
    }),
};

import { queryOptions } from "@tanstack/react-query";
import { getAdminUsers } from "../actions/user/get-admin-users";
import { getMe } from "../actions/user/get-me";
import { getUserDeletionPreview } from "../actions/user/get-user-deletion-preview";
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

  adminList: () =>
    queryOptions({
      queryKey: userKeys.adminList(),
      queryFn: getAdminUsers,
    }),

  deletionPreview: (userId: string) =>
    queryOptions({
      queryKey: [...userKeys.all, "deletion-preview", userId],
      queryFn: () => getUserDeletionPreview(userId),
    }),
};

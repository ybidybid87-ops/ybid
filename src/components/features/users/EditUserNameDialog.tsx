"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import useUpdateAdminUserName from "@/hooks/user/useUpdateAdminUserName";
import { updateUserNameSchema, type UpdateUserNameInput } from "@/schemas/updateUserNameSchema";
import type { AdminUser } from "@/types/users";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  user: AdminUser;
  onClose: () => void;
}

export default function EditUserNameDialog({ user, onClose }: Props) {
  const { mutate, isPending } = useUpdateAdminUserName();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateUserNameInput>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: user.name,
    },
    mode: "onChange",
  });

  const onSubmit = (data: UpdateUserNameInput) => {
    mutate(
      {
        userId: user.id,
        data,
      },
      {
        onSuccess: () => {
          toast.success("사용자 이름을 변경했다.");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 이름 변경</DialogTitle>
          <DialogDescription>{user.email} 계정의 이름을 변경한다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("name")}
              placeholder="사용자 이름"
              maxLength={50}
              disabled={isPending}
            />

            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              취소
            </Button>

            <Button type="submit" disabled={!isValid || isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

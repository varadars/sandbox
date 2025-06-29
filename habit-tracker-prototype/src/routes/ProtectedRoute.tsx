import { Navigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/components/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { groupId } = useParams<{ groupId: string }>();
  const { player } = useAuth();

  if (!player) return <Loading />;

  return player.group.id !== Number(groupId) ? (
    <Navigate
      to={`/group/${player.group.id}`}
      replace
    />
  ) : (
    children
  );
}

import Unauthorized from "@/components/unauthorized";
import { verifyAndAcceptInvitation, getAuthUserDetails } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: { state: string; code: string };
}) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();
  if (!user) return;

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true
  );

  if (params.state) {
    const statePath = params.state.split("___")[0];
    const stateSubaccountId = params.state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${params.code}`
    );
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default page;

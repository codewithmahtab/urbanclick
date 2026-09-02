import AccountLoginHref from "./account-login-href";
import DropdownContent from "./dropdown-content";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AccountDropdownProps = {
  user: User | null;
};

export default async function AccountDropdown({ user }: AccountDropdownProps) {
  return (
    <AccountLoginHref
      user={user}
      dropdownContent={<DropdownContent user={user} />}
    />
  );
}

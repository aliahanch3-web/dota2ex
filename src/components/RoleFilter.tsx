import { roles, Role } from "@/data/heroes";

interface RoleFilterProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  heroCount: Record<string, number>;
}

const roleStyles: Record<Role, { active: string; inactive: string }> = {
  All: {
    active: "bg-primary text-primary-foreground",
    inactive: "bg-secondary hover:bg-secondary/80 text-foreground",
  },
  Carry: {
    active: "bg-hero-carry text-white",
    inactive: "role-bg-carry role-carry hover:bg-hero-carry/30",
  },
  Support: {
    active: "bg-hero-support text-white",
    inactive: "role-bg-support role-support hover:bg-hero-support/30",
  },
  Offlane: {
    active: "bg-hero-offlane text-white",
    inactive: "role-bg-offlane role-offlane hover:bg-hero-offlane/30",
  },
  Mid: {
    active: "bg-hero-mid text-white",
    inactive: "role-bg-mid role-mid hover:bg-hero-mid/30",
  },
};

const roleLabels: Record<Role, string> = {
  All: "همه",
  Carry: "Carry",
  Support: "Support",
  Offlane: "Offlane",
  Mid: "Mid",
};

export const RoleFilter = ({ activeRole, onRoleChange, heroCount }: RoleFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onRoleChange(role)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 border border-transparent ${
            activeRole === role
              ? roleStyles[role].active
              : roleStyles[role].inactive
          }`}
        >
          {roleLabels[role]}
          <span className="ml-2 opacity-70">({heroCount[role] || 0})</span>
        </button>
      ))}
    </div>
  );
};

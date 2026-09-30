export const ROLE_ACCESS = {
  ADMIN: [
    "/dashboard",
    "/purchases",
    "/transfers",
    "/assignments",
    "/expenditure",
    "/audit-logs",
    "/users",
    "/equipment-types",
  ],
  BASE_COMMANDER: [
    "/dashboard",
    "/purchases",
    "/transfers",
    "/assignments",
    "/expenditure",
  ],
  LOGISTICS_OFFICER: ["/purchases", "/transfers"],
};

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function getRoleHome(role) {
  if (role === "LOGISTICS_OFFICER") return "/purchases";
  if (ROLE_ACCESS[role]) return "/dashboard";
  return "/";
}

export function getRoleLabel(role) {
  return {
    ADMIN: "Admin",
    BASE_COMMANDER: "Base Commander",
    LOGISTICS_OFFICER: "Logistics Officer",
  }[role] || "Account";
}

export function isBaseScoped(user) {
  return user?.role === "BASE_COMMANDER";
}

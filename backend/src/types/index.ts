export interface AuthenticatedUser {
  id: string;
  role: string;
}
// Removed global Express.Request extension to avoid type conflict 
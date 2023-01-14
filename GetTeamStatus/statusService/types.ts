export interface TeamStatus {
  teamMates: TeamMateStatus[];
}

export interface TeamMateStatus {
  name: string;
  isOnline: boolean;
}

export interface TeamStatusService {
  getStatus: GetStatus;
}

export type GetStatus = () => Promise<TeamStatus>;

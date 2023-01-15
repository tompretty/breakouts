export interface TeamStatus {
  teamMates: TeamMateStatus[];
}

export interface TeamMateStatus {
  name: string;
  isOnline: boolean;
}

export interface TeamStatusService {
  getStatus: GetStatus;
  updateStatus: UpdateStatus;
}

export type GetStatus = () => Promise<TeamStatus>;

export type UpdateStatus = (status: TeamStatus) => Promise<void>;

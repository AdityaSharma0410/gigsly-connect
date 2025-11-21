export type UserRole = 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';

export interface ApiUser {
  id: number;
  fullName: string;
  email: string;
  mobile?: string | null;
  role: UserRole;
  verified?: boolean | null;
  active?: boolean | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
  primaryCategory?: string | null;
  skills?: string[];
  hourlyRate?: number | null;
  location?: string | null;
  averageRating?: number | null;
  reviewCount?: number | null;
  completedProjects?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: ApiUser;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
}

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'CLOSED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  budgetMin?: number | null;
  budgetMax?: number | null;
  deadline?: string | null;
  requiredSkills?: string | null;
  location?: string | null;
  remote?: boolean | null;
  estimatedDuration?: string | null;
  clientId?: number | null;
  clientName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  assignedProfessionalId?: number | null;
  assignedProfessionalName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProposalResponse {
  id: number;
  taskId: number;
  taskTitle?: string;
  professionalId: number;
  professionalName?: string;
  message: string;
  proposedAmount?: number | null;
  estimatedDuration?: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
}

